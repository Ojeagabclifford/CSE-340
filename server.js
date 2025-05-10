/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");

/* ***********************
 * Middleware
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout","./layouts/layout");
app.use(express.static("public")); // Serve static files

/* ***********************
 * Routes
 *************************/
app.get("/", function (req, res) {
  res.render("index", { title: "Home" }); // Index route moved to the routes section
});

app.use(static); // Use the static route

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST 

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app Error: /opt/render/project/src/views/layouts/layout.ejs:19listening on ${host}:${port}`);
});