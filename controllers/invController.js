const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
let f=0;
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  if (!data || data.length === 0) {
    // No vehicles found for this classification
    let nav = await utilities.getNav()
    return res.render("inventory/classification", {
      title: "No Vehicles Found",
      nav,
      grid: "<p>No vehicles found for this classification.</p>",
    })
  }
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("inventory/classification", {
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


invCont.buildBymanagement= async function (req, res, next) {
    let nav = await utilities.getNav();
    // const className = data[0].classification_name
    res.render("./inventory/management", { // <-- removed ../
      title: "Vechicle Management",
      nav,
    });
  
}
invCont.buildByAddClassificationId = async function (req, res, next) {
    let nav = await utilities.getNav();
    // const className = data[0].classification_name
    res.render("./inventory/addclassification", { // <-- removed ../
      title: "Add Classification",
      nav,
       errors: null,
    });
  
}



invCont.buildByaddInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    let classificationDrop = await utilities.buildClassificationList();
  res.render("./inventory/addinventory", { 
      title: "Add Inventory",
      nav,
      classificationDrop,
       errors: null,
    });
}

invCont.classification = async function (req, res, next) {
 
    let nav = await utilities.getNav();
    const { classification_name } = req.body;

    const regResult = await invModel.classification(classification_name);

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, the ${classification_name} classification has been added.`
      );
      return res.redirect("/inv/management");
    } else {
      req.flash("notice", "Sorry, the new classification failed.");
      res.status(501).render("inventory/addclassification", {
        title: "Add Classification",
        nav,
      });
    }
  } 


invCont.inventory = async function (req, res) {
  let nav = await utilities.getNav();
   let classificationDrop = await utilities.buildClassificationList();
  let {
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
  } = req.body;






  const regResult = await invModel.inventory(
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
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, the car has been added.`
    );
    return res.redirect("/inv/management");
  } else {
    req.flash("notice", `${inv_price}sorry, the new inventory failed.`);
    res.status(501).render("inventory/addinventory", {
      title: "Add Inventory",
      nav,
      classificationDrop
      
    });
  }
};


module.exports = invCont;