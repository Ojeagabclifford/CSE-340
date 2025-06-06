const utilities = require(".")
const { body,  validationResult } = require("express-validator")
const validate = {}
const inventoryModel= require("../models/inventory-model")

  
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a classification name (at least 3 letters).")
    .custom(async (classification_name) => {
  const exists = await inventoryModel.checkExistingclassification(classification_name)
  if (exists) { // check if rowCount is greater than 0
    throw new Error(" Class exists. Please add a different classification name")
  }
}),
  ]
}


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkclassData = async (req, res, next) => {
  const { classification_name } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/addclassification", { // fixed path
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}



validate.addInventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Classification is required."),

    body("inv_make")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Inventory make must be at least 3 characters."),

    body("inv_model")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Inventory model must be at least 3 characters."),

    body("inv_description")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Inventory description must be at least 3 characters."),

    body("inv_image")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Inventory image URL is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Inventory thumbnail URL is required."),

    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Inventory price is required.")
      .isDecimal()
      .withMessage("Inventory price must be a valid number."),

    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Inventory year is required.")
      .isInt({ min: 1886 }) // the year the first car was made
      .withMessage("Inventory year must be a valid year."),

    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("Inventory miles is required.")
      .isInt({ min: 0 })
      .withMessage("Inventory miles must be a positive number."),

    body("inv_color")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Inventory color must be at least 3 characters.")
  ];
};




validate.checkinvData = async (req, res, next) => {
  const {  classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color} = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
     let classificationDrop = await utilities.buildClassificationList();
    res.render("inventory/addinventory", { // fixed path
      errors,
      title: "Inventory",
      nav,
      classificationDrop,
      
     classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
    })
    return
  }
  next()
}


    module.exports = validate