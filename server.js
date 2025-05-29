/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");

const env = require("dotenv").config();
const app = express();

const static = require("./routes/static");
const expressLayouts = require("express-ejs-layouts");
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/index");

// Inventory routes
// app.use("/inv", inventoryRoute)

/* ***********************
 * Middleware
 *************************/


app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout","layouts/layout");
// app.use(express.static("public")); // Serve static files

app.use(static);

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inv", inventoryRoute);
/* ***********************

 * Routes
 *************************/
// app.get("/", baseController.buildHome)
app.get("/test", (req, res) => {
  res.render("inventory/detail", { title: "Test", nav: "", vehicle: {} });
});

app.get("/crash", (req, res, next) => {
  next(new Error("This is a test crash!"));
});

//404
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

 // Use the static route

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
 console.log(`App listening on ${host || "localhost"}:${port}`);
});

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  let message;
  let title;

  if (err && err.status === 404) {
    title = '404 Not Found';
    message = err.message || 'Sorry, we appear to have lost that page.';
  } else {
    title = 'Server Error';
    message = 'Oh no! There was a crash. Maybe try a different route?';
  }

  res.status(err.status || 500).render("errors/error", {
    title,
    message,
    nav
  });
});