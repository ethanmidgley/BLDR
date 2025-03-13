const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const path = require("path");

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

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  //register api
  app.post("/users/register", async (request, response) => {
    const { email, fullname, password } = request.body;

    try {
      const [result] = await db.execute(
        "INSERT INTO `bldr_users` (`name`, `email`, `password`) VALUES (?, ?, ?);",
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
  app.post("/users/login", async (request, response) => {
    response.json({ data: "things" });
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
