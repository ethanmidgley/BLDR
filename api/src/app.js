const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");

// Load environment variables for database password
require("dotenv").config();

const main = async () => {
  const app = express();
  const port = 3000;

  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  // db.connect((error) => {
  //   if (error) {
  //     console.error("Error connecting to MySQL database:", error);
  //     return;
  //   } else {
  //     console.log("Connected to MySQL database!");
  //   }
  // });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/", async (request, response) => {
    const t = await db.query("SELECT * FROM bldr_users");
    response.json({ data: t[0] });
  });

  app.listen(port);
};

main()
  .then(() => {
    console.log("BLDR Api Listening 🚀🚀🚀");
  })
  .catch((err) => console.error("FATAL ERROR:", err));
