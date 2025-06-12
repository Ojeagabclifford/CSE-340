const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');

// Login page
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/logout", accountController.logout);
// Registration page
router.get("/register", utilities.handleErrors(accountController.buildRegister));


router.get("/update/:account_id", utilities.handleErrors(accountController.buildByUpdateAcoount))

router.post("/update/",
  regValidate.updateRules(),
  regValidate.checkupdData, 
  
   utilities.handleErrors(accountController.updateAcc))

   router.post("/update-password",
    regValidate.updatePasswordRules(),
  regValidate.checkupdPasswordData,
    utilities.handleErrors(accountController.updatepassword))

router.get("/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount))
// Process the registration data
// If you have validation, uncomment and use it:
// router.post(
//   "/register", 
//   regValidate.registrationRules(),
//   regValidate.checkRegData,
//   utilities.handleErrors(accountController.registerAccount)
// );LSO0Y =mgLxxo

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
  regValidate.loginRules(),
  regValidate.checkLogData,
 utilities.handleErrors(accountController.accountLogin)
)
module.exports = router;