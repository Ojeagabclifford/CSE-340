const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');

// Login page
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Registration page
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
// If you have validation, uncomment and use it:
// router.post(
//   "/register",
//   regValidate.registrationRules(),
//   regValidate.checkRegData,
//   utilities.handleErrors(accountController.registerAccount)
// );

// Without validation:
router.post("/register", regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount));

// Placeholder for login POST (implement when ready)
// router.post("/login", (req, res) => {
//   res.status(200).send('login process');
// });
// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)
module.exports = router;