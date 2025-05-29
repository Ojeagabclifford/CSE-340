const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", { // <-- removed ../
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  try {
    const data = await invModel.getInventoryById(inv_id);
    let nav = await utilities.getNav();
     const detailHtml = await utilities.buildInventoryDetails(data);
    if (!data) {
      return next(); // <-- fixed error handling
    }
    // const className = data[0].classification_name
    res.render("./inventory/detail", { // <-- removed ../
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      nav,
      detailHtml
    });
  } catch (error) {
    next(error);
  }
}

module.exports = invCont;