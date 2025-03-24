const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const multer = require("multer");
const upload = multer({ dest: path.resolve(__dirname, "../uploads/") });
const fs = require("fs");

// Load environment variables for database password
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const isLoggedIn = (request, response, next) => {
  if (request.user && request.isAuthenticated()) {
    next();
  } else {
    response.status(403).send();
  }
};

const main = async () => {
  const app = express();
  const port = 3000;

  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async function verify(email, password, cb) {
        try {
          const [result] = await db.query(
            "SELECT * FROM `CS317-bldr-users` WHERE email = ?",
            [email],
          );
          if (result.length === 0) {
            return cb(null, false, { message: "Incorrect E-mail" });
          }
          if (!(password === result[0].password)) {
            return cb(null, false, { message: "INCORRECT PASSWORD!!" });
          } else {
            return cb(null, result[0]);
          }
        } catch (err) {
          return cb(err);
        }
      },
    ),
  );

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(
    session({
      secret: "insert witty secret",
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(passport.authenticate("session"));

  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, { id: user.id, email: user.email });
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });

  //register api
  app.post("/users/register", async (request, response) => {
    const { email, fullname, password } = request.body;

    try {
      const [result] = await db.execute(
        "INSERT INTO `CS317-bldr-users` (`full_name`, `email`, `password`) VALUES (?, ?, ?);",
        [fullname, email, password],
      );
      response.json({
        data: {
          user: {
            id: result.insertId,
            email: email,
            fullname: fullname,
            password: password,
          },
        },
      });
    } catch {
      response.status(500).send({ error: "failed to create user" });
      return;
    }
  });

  //login endpoints
  app.post(
    "/users/login",
    passport.authenticate("local"),
    (request, response) => {
      response.json({
        user: request.user,
      });
    },
  );

  //log endpoints

  //add a climb
  app.post("/log/add", isLoggedIn, async (request, response) => {
    const { type, time, level, success, angle, lat, lon, height, date } =
      request.body;

    try {
      const [result] = await db.execute(
        "INSERT INTO `CS317-bldr-climbs` (`user_id`, `type`, `time`, `level`, `success`, `angle`, `lat`, `lon`, `height`, `date`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [
          request.user.id,
          type,
          time,
          level,
          success,
          angle,
          lat,
          lon,
          height,
          date,
        ],
      );

      response.json({
        data: {
          climb: {
            id: result.insertId,
            user_id: request.user.id,
            type: type,
            time: time,
            level: level,
            success: success,
            angle: angle,
            lat: lat,
            lon: lon,
            height: height,
            date: date,
          },
        },
      });
    } catch (error) {
      console.log(error);
      response.status(500).send({ error: "failed to save to user log" });
      return;
    }
  });

  //get user climbs
  app.get("/log/fetch", isLoggedIn, async (request, response) => {
    //TODO:replace this with the acutal user id when we can

    try {
      const [result] = await db.execute(
        "SELECT *, case when exists (select 1 from `CS317-bldr-posts` p where p.climb_id=c.id) then 1 else 0 end as posted FROM `CS317-bldr-climbs` c WHERE user_id = ? ORDER BY c.date DESC, c.id DESC;",
        [request.user.id],
      );
      response.json({ data: result });
    } catch {
      response.status(500).send({ error: "failed to read user log" });
      return;
    }
  });

  //posts endpoints
  app.post(
    "/posts/add",
    isLoggedIn,
    upload.single("image"),
    async (request, response) => {
      const { title, description, date, climb_id } = request.body;

      try {
        const [result] = await db.execute(
          "INSERT INTO `CS317-bldr-posts` (`user_id`,`title`,`image`,`description`,`date`,`climb_id`) VALUES (?,?,?,?,?,?);",
          [
            request.user.id,
            title,
            request.file.filename,
            description,
            date,
            climb_id,
          ],
        );
        response.json({
          data: {
            user: {
              id: result.insertId,
              user_id: request.user.id,
              title: title,
              image: request.file.filename,
              description: description,
              date: date,
              climb_id: climb_id,
            },
          },
        });
      } catch (error) {
        console.log(error);
        response.status(500).send({ error: "Failed to create post" });
        return;
      }
    },
  );

  app.get("/posts/fetch", isLoggedIn, async (request, response) => {
    const result = [];
    try {
      const [posts] = await db.query(
        "SELECT cbp.id, cbp.user_id, cbp.title, cbp.image, cbp.date, cbp.description, cbu.full_name as full_name, cbc.time, cbc.`level`, cbc.lat, cbc.lon, cbc.angle, cbc.type FROM `CS317-bldr-posts` cbp LEFT JOIN `CS317-bldr-users` cbu on cbp.user_id = cbu.id LEFT JOIN `CS317-bldr-climbs` cbc on cbp.climb_id = cbc.id ORDER BY cbp.date DESC, cbp.id DESC;",
      );

      for (const post of posts) {
        const [comments] = await db.query(
          "SELECT cbu.full_name as author, cbc.date, cbc.content FROM `CS317-bldr-comments` cbc LEFT JOIN `CS317-bldr-users` cbu ON cbu.id = cbc.user_id WHERE cbc.post_id = ?",
          [post.id],
        );

        result.push({
          id: post.id,
          user_id: post.user_id,
          title: post.title,
          image: post.image,
          description: post.description,
          author: post.full_name,
          climb: {
            time: post.time,
            level: post.level,
            angle: post.angle,
            type: post.type,
            lat: post.lat,
            lon: post.lon,
          },
          comments: comments,
        });
      }

      response.json(result);
    } catch (err) {
      console.log(err);
      response.status(500).send({ error: "Failed" });
      return;
    }
  });

  app.get("/image/:uri", async (request, response) => {
    const fileStream = fs.createReadStream(
      path.resolve(__dirname, "../uploads/" + request.params.uri),
    );
    fileStream.on("open", () => {
      fileStream.pipe(response);
    });
    fileStream.on("error", () => {
      response.status(404).send();
    });
  });

  //comments endpoints
  app.post("/comments/add", isLoggedIn, async (request, response) => {
    const { date, content, post_id } = request.body;
    try {
      const [result] = await db.execute(
        "INSERT INTO `CS317-bldr-comments` (`user_id`, `date`, `content`, `post_id`) VALUES (?, ?, ?, ?);",
        [request.user.id, date, content, post_id],
      );

      response.json({
        data: {
          id: result.insertId,
          user_id: request.user.id,
          date: date,
          content: content,
          post_id: post_id,
        },
      });
    } catch (error) {
      console.error("Error inserting comment:", error);
      response.status(500).json({ error: "Unable to post comment" });
    }
  });

  app.listen(port);
};

main()
  .then(() => {
    console.log("BLDR Api Listening 🚀🚀🚀");
  })
  .catch((err) => console.error("FATAL ERROR:", err));
