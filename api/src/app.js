const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local");

// Load environment variables for database password
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });


const main = async () => {
  const app = express();
  const port = 3000;

  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  passport.use(new LocalStrategy({usernameField: "email", passwordField: "password"}, async function verify(email, password, cb) {
    try {
      const [ result ] = await db.query('SELECT * FROM `CS317-bldr-users` WHERE email = ?', [ email ]);
        if (result.length === 0){
          return cb(null, false, { message: 'Incorrect E-mail' });
        }
        if (!(password === result[0].password)){
          return cb(null, false, { message: "INCORRECT PASSWORD!!" });
        } else {
          return cb(null, result);
        }
      } catch (err) {
        return cb(err);
      }
  }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({
    secret: "insert witty secret",
    resave: false,
    saveUninitialized: false 
  }));
  app.use(passport.authenticate('session'));

  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, email: user.email });
    });
  });

  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

  //register api
  app.post("/users/register", async (request, response) => {
    const { email, fullname, password } = request.body;

    try {
      const [result] = await db.execute(
        "INSERT INTO `CS317-bldr-users` (`name`, `email`, `password`) VALUES (?, ?, ?);",
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
  app.post("/users/login", passport.authenticate('local'), (request, response) => {
    response.json({
      data: {
        success: "YES YAHOOO"
      }
    });
  });

  //log endpoints
  app.post("/log/add", async (request, response) => {});

  app.get("/log/fetch", async (request, response) => {});

  //posts endpoints
  app.post("/posts/add", async (request, response) => {});

  app.get("/posts/fetch", async (request, response) => {});

  //comments endpoints
  app.post("/comments/add", async (request, response) => {});

  app.listen(port);
};

main()
  .then(() => {
    console.log("BLDR Api Listening 🚀🚀🚀");
  })
  .catch((err) => console.error("FATAL ERROR:", err));
