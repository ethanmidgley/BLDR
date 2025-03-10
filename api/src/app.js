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

  app.listen(port);
};

main()
  .then(() => {
    console.log("BLDR Api Listening 🚀🚀🚀");
  })
  .catch((err) => console.error("FATAL ERROR:", err));
