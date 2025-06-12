
const bcrypt = require("bcryptjs")

const utilities = require("../utilities");
const  accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  // req.flash("notice", "This is a flash message.")
  res.render("account/login", {
    title: "Login",
    nav,
    errors:null,
  });
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    
  })
}


/* ****************************************
*  Deliver acount view
* *************************************** */

async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
   const accountData = await accountModel.getAccountByEmail(req.session.account_email);
   req.flash("notice", "You're logged in")
  res.render("account/account", {
    title: "Logined",
    nav,
    
    
  })
}


async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
   const accountData = await accountModel.getAccountByEmail(req.session.account_email);
   req.flash("notice", "You're logged in")
  res.render("account/account", {
    title: "Logined",
    nav,
    
    
  })
}


async function buildByUpdateAcoount(req, res, next) {
  let nav = await utilities.getNav()
   
   req.flash("notice", "You're logged in")
  res.render("account/update-account", {
    title: "Update",
    nav,
    errors:null
    
    
  })
}




/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
  return res.redirect("/account/login");
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}



/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  } 
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {

       delete accountData.account_password
      req.session.loggedin = true;
      req.session.account_email = accountData.account_email;
      req.session.account_firstname = accountData.account_firstname;
      req.session.account_lastname = accountData.account_lastname;
      req.session.account_type = accountData.account_type;
        
      
      req.session.account_id = accountData.account_id;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login ",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


async function logout(req, res) {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err);
      // Optionally, handle the error
    }
    res.clearCookie("jwt"); // Remove JWT cookie if you use it
    res.redirect("/"); // Redirect to home or login page
  });
}









/* ***************************
 *  Build edit inventory view
 * ************************** */
async function updataAcc(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  
  const itemData = await accountModel.getAccountByEmail(account_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id, 
  })
}

async function updateAcc(req, res, next) {
  let nav = await utilities.getNav();
  let {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body;

  // Ensure account_id is an integer
  if (Array.isArray(account_id)) account_id = account_id[0];
  account_id = parseInt(account_id, 10);

  try {
    const updateResult = await accountModel.updateacc(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult) {
        req.session.account_firstname = updateResult.account_firstname;
  req.session.account_lastname = updateResult.account_lastname;
  req.session.account_email = updateResult.account_email;
  req.session.account_id = updateResult.account_id;
      req.flash("notice", `The account for ${account_firstname} was successfully updated.`);
      
      return res.redirect("/account");
    } else {
      throw new Error("Update failed.");
    }
  } catch (error) {
    req.flash("notice", "Sorry, the update failed: " + error.message);
    res.status(501).render("account/update-account", {
      title: "Update",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    });
  }
}


async function updatepassword(req, res, next) {
  let nav = await utilities.getNav();
  let { account_id, new_password } = req.body;

  if (Array.isArray(account_id)) account_id = account_id[0];
  account_id = parseInt(account_id, 10);

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password in DB
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (updateResult) {
      req.flash("notice", "Password was successfully updated.");
      return res.redirect("/account");
    } else {
      throw new Error("Password update failed.");
    }
  } catch (error) {
    req.flash("notice", "Sorry, the password update failed: " + error.message);
    res.status(501).render("account/update-account", {
      title: "Update",
      nav,
      errors: null,
      account_id
    });
  }
}




module.exports = { buildLogin,buildRegister,registerAccount,accountLogin,buildAccount,logout, buildByUpdateAcoount,updateAcc,updatepassword};