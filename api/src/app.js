const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");


// Load environment variables for database password
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
console.log(process.env.DB_HOST);
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
        success: true,
      });
    },
  );

  //log endpoints

  //add a climb
  app.post("/log/add", async (request, response) => {
    const { type, time_s, level, success, angle, lat, lon, height } =
      request.body;

    try {
      const [result] = await db.execute(
        "INSERT INTO `CS317-bldr-climbs` (`user_id`, `type`, `time`, `level`, `success`, `angle`, `lat`, `lon`, `height`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [
          request.user.id,
          type,
          time_s,
          level,
          success,
          angle,
          lat,
          lon,
          height,
        ],
      );

      response.json({
        data: {
          climb: {
            id: result.insertId,
            user_id: request.user.id,
            type: type,
            time: time_s,
            level: level,
            success: success,
            angle: angle,
            lat: lat,
            lon: lon,
            height: height,
          },
        },
      });
    } catch {
      response.status(500).send({ error: "failed to save to user log" });
      return;
    }
  });

  //get user climbs
  app.get("/log/fetch", async (request, response) => {
    //TODO:replace this with the acutal user id when we can

    try {
      const [result] = await db.execute(
        "SELECT * FROM `CS317-bldr-climbs` WHERE user_id=?",
        [request.user.id],
      );
      response.json({ data: result });
    } catch {
      response.status(500).send({ error: "failed to read user log" });
      return;
    }
  });

  //posts endpoints
  app.post("/posts/add", upload.single("image"), async (request, response) => {
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
  });

  app.get("/posts/fetch", async (request, response) => {
    const result = [];
    try {
      const [posts] = await db.query(
        "SELECT cbp.id, cbp.title, cbp.image, cbp.date, cbp.description, cbu.full_name as full_name, cbc.time, cbc.`level`, cbc.lat, cbc.lon FROM `CS317-bldr-posts` cbp LEFT JOIN `CS317-bldr-users` cbu on cbp.user_id = cbu.id LEFT JOIN `CS317-bldr-climbs` cbc on cbp.climb_id = cbc.id",
      );

      for (const post of posts) {
        const [comments] = await db.query(
          "SELECT cbu.full_name as author, cbc.date, cbc.content FROM `CS317-bldr-comments` cbc LEFT JOIN `CS317-bldr-users` cbu ON cbu.id = cbc.user_id WHERE cbc.post_id = ?",
          [post.id],
        );

        result.push({
          id: post.id,
          title: post.title,
          image: post.image,
          author: post.full_name,
          climb: {
            time: post.time,
            level: post.level,
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
      path.join("uploads", request.params.uri),
    );
    fileStream.on("open", () => {
      fileStream.pipe(response);
    });
    fileStream.on("error", () => {
      response.status(404).send();
    });
  });

  //comments endpoints
  app.post("/comments/add", async (request,response) => {
    const {user_id,date,content,post_id} = request.body;
    console.log("tried");
    try{
      const [comments] = await db.query(
        "INSERT INTO `317-bldr-comments` (`user_id`, `date`, `content`, `post_id`) VALUES (?, ?, ?, ?);",
        [user_id, date, content, post_id]
      );
      
      
      response.json({
        data: {
          id: result.insertId,
          user_id: user_id,
          date: date,
          content: content,  
          post_id: post_id
        }

      })
    }
    catch (error) {
      console.error("Error inserting comment:", error);
      response.status(500).json({ error: "Unable to post comment"});

    }
  });
}
main()
  .then(() => {
    console.log("BLDR Api Listening 🚀🚀🚀");
  })
  .catch((err) => console.error("FATAL ERROR:", err));
