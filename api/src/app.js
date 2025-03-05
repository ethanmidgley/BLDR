const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.json({ message: "bldr backend" });
});

app.listen(port, () => {
  console.log("BLDR Api Listening 🚀🚀🚀");
});
