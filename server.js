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
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const utilities = require("./utilities/index");
const session = require("express-session");
const pool = require('./database/');
const bodyParser = require("body-parser")

/* ***********************
 * App Settings
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");

/* ***********************
 * Middleware
 *************************/
// For Render/Heroku: trust proxy for secure cookies
app.set('trust proxy', 1);

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: 'lax'
  }
}));

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Serve static files
// app.use(express.static("public"));
app.use(static);

/* ***********************
 * Routes
 *************************/
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute);

// app.use("/account", require("./routes/accountRoute"))
app.use("/account", accountRoute);




app.get("/test", (req, res) => {
  res.render("inventory/detail", { title: "Test", nav: "", vehicle: {} });
});

app.get("/crash", (req, res, next) => {
  next(new Error("This is a test crash!"));
});

/* ***********************
 * 404 Handler (after all routes)
 *************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
 * Express Error Handler (last)
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

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on ${host || "localhost"}:${port}`);
});