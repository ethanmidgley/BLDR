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
const argon2 = require("argon2");

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

          const valid_password = await argon2.verify(
            result[0].password,
            password,
          );

          if (!valid_password) {
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
  app.post(
    "/users/register",
    upload.single("image"),
    async (request, response) => {
      const { email, fullname, password } = request.body;
      const hashed_password = await argon2.hash(password);

      try {
        const [result] = await db.execute(
          "INSERT INTO `CS317-bldr-users` (`full_name`, `email`, `password`,`image`) VALUES (?, ?, ?, ?);",
          [fullname, email, hashed_password, request.file.filename],
        );
        response.json({
          data: {
            user: {
              id: result.insertId,
              email: email,
              fullname: fullname,
              password: hashed_password,
              image: request.file.filename,
              bio: "",
            },
          },
        });
      } catch {
        response.status(500).send({ error: "failed to create user" });
        return;
      }
    },
  );

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

  //user data api
  app.get("/user/:id", isLoggedIn, async (request, response) => {
    try {
      const [result] = await db.query(
        "SELECT `full_name`, `image`, `bio` from `CS317-bldr-users` where id = ?;",
        [request.params.id],
      );

      if (!result) {
        response.status(404).send({ error: "failed to find user" });
        return;
      }

      response.json({
        fullname: result[0].full_name,
        image: result[0].image,
        bio: result[0].bio,
      });
    } catch (error) {
      console.log(error);
      response.status(500).send({ error: "failed to fetch user data" });
      return;
    }
  });

  //log endpoints

  //add a climb
  app.post("/log/add", isLoggedIn, async (request, response) => {
    const { type, time, level, success, lat, lon, height, date } = request.body;

    try {
      const [result] = await db.execute(
        "INSERT INTO `CS317-bldr-climbs` (`user_id`, `type`, `time`, `level`, `success`, `lat`, `lon`, `height`, `date`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [request.user.id, type, time, level, success, lat, lon, height, date],
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

  app.get("/points/fetch", isLoggedIn, async (request, response) => {
    const d_fall_back = 0.3;
    const d_lat = parseFloat(request.query.lat_delta) || d_fall_back;
    const d_lon = parseFloat(request.query.lon_delta) || d_fall_back;
    const lat = parseFloat(request.query.lat) || 55.8617;
    const lon = parseFloat(request.query.lon) || -4.2583;

    const lat_lower = lat - d_lat;
    const lat_upper = lat + d_lat;
    const lon_lower = lon - d_lon;
    const lon_upper = lon + d_lon;

    const result = [];

    try {
      const [posts] = await db.query(
        "SELECT cbp.id, cbp.user_id, cbp.title, cbp.image, cbp.date, cbp.description, cbu.full_name as full_name, cbc.time, cbc.`level`, cbc.lat, cbc.lon, cbc.type FROM `CS317-bldr-posts` cbp LEFT JOIN `CS317-bldr-users` cbu on cbp.user_id = cbu.id LEFT JOIN `CS317-bldr-climbs` cbc on cbp.climb_id = cbc.id WHERE cbc.lat >= ? AND cbc.lat <= ? AND cbc.lon >= ? AND cbc.lon <= ? ORDER BY cbp.date DESC, cbp.id DESC LIMIT ?;",
        [lat_lower, lat_upper, lon_lower, lon_upper, 20],
      );

      for (const post of posts) {
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
            type: post.type,
            lat: post.lat,
            lon: post.lon,
          },
        });
      }

      response.json(result);
    } catch (err) {
      console.log(err);
      response.status(500).send({ error: "Failed" });
      return;
    }
  });

  app.get("/posts/:id/comments", isLoggedIn, async (request, response) => {
    const post_id = parseInt(request.params.id) || -1;

    if (post_id == -1) {
      response.status(500).send({ error: "Failed" });
    }

    const next_cursor = parseInt(request.query.next_cursor) || 2147483647;
    const limit = parseInt(request.query.limit) || 3;

    try {
      const [comments] = await db.query(
        "SELECT cbc.id, cbu.full_name as author, cbc.date, cbc.content FROM `CS317-bldr-comments` cbc LEFT JOIN `CS317-bldr-users` cbu ON cbu.id = cbc.user_id WHERE cbc.post_id = ? AND cbc.id <= ? ORDER BY cbc.id DESC LIMIT ?",
        [post_id, next_cursor, limit + 1],
      );

      response.json(
        comments.length == 1 || comments.length <= limit
          ? { next_cursor: null, comments: comments }
          : {
              next_cursor: comments.pop()?.id || null,
              comments: comments,
            },
      );
    } catch (err) {
      console.log(err);
      response.status(500).send({ error: "Failed" });
      return;
    }
  });

  app.get("/posts/fetch", isLoggedIn, async (request, response) => {
    const next_cursor = parseInt(request.query.next_cursor) || 2147483647;
    const limit = parseInt(request.query.limit) || 20;

    const result = [];

    try {
      const [posts] = await db.query(
        "SELECT cbp.id, cbp.user_id, cbp.title, cbp.image, cbp.date, cbp.description, cbu.full_name as full_name, cbc.time, cbc.`level`, cbc.lat, cbc.lon, cbc.type FROM `CS317-bldr-posts` cbp LEFT JOIN `CS317-bldr-users` cbu on cbp.user_id = cbu.id LEFT JOIN `CS317-bldr-climbs` cbc on cbp.climb_id = cbc.id WHERE cbp.id <= ? ORDER BY cbp.date DESC, cbp.id DESC LIMIT ?;",
        [next_cursor, limit + 1],
      );

      for (const post of posts) {
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
            type: post.type,
            lat: post.lat,
            lon: post.lon,
          },
        });
      }

      response.json(
        result.length == 1 || result.length <= limit
          ? { next_cursor: null, posts: result }
          : {
              next_cursor: result.pop()?.id || null,
              posts: result,
            },
      );
    } catch (err) {
      console.log(err);
      response.status(500).send({ error: "Failed" });
      return;
    }
  });

  // user specific climbs
  app.get("/posts/fetchbyuser/:id", isLoggedIn, async (request, response) => {
    const next_cursor = parseInt(request.query.next_cursor) || 2147483647;
    const limit = parseInt(request.query.limit) || 20;
    //const user_id = parseInt(request.params.id) || -1;
    //if (user_id == -1){
    //  response.status(500).send({ error: "Failed epicly" });
    //}

    const result = [];

    try {
      const [posts] = await db.query(
        "SELECT cbp.id, cbp.user_id, cbp.title, cbp.image, cbp.date, cbp.description, cbu.full_name as full_name, cbc.time, cbc.`level`, cbc.lat, cbc.lon, cbc.type FROM `CS317-bldr-posts` cbp LEFT JOIN `CS317-bldr-users` cbu on cbp.user_id = cbu.id LEFT JOIN `CS317-bldr-climbs` cbc on cbp.climb_id = cbc.id WHERE cbp.id <= ? AND cbu.id = ? ORDER BY cbp.date DESC, cbp.id DESC LIMIT ?;",
        [next_cursor, request.params.id, limit + 1],
      );

      for (const post of posts) {
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
            type: post.type,
            lat: post.lat,
            lon: post.lon,
          },
        });
      }

      response.json(
        result.length == 1 || result.length <= limit
          ? { next_cursor: null, posts: result }
          : {
              next_cursor: result.pop()?.id || null,
              posts: result,
            },
      );
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

  app.post("/profile/bio-edit", isLoggedIn, async (request, response) => {
    const { bio } = request.body;

    try {
      await db.execute(
        "UPDATE `CS317-bldr-users` SET `bio` = ? WHERE id = ?;",
        [bio, request.user.id],
      );
      response.json({
        bio: bio,
      });
    } catch (error) {
      console.error("Error updating bio:", error);
      response.status(500).json({ error: "Unable to update bio" });
    }
  });

  app.listen(port);
};

main()
  .then(() => {
    console.log("BLDR Api Listening 🚀🚀🚀");
  })
  .catch((err) => console.error("FATAL ERROR:", err));
