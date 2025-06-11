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
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", { // <-- removed ../
      title: "Vechicle Management",
      nav,
      classificationSelect
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


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}



/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let classificationDrop = await utilities.buildClassificationList();
  const itemData = await invModel.getInventoryById(inv_id)
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
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  // Handle possible array values (from duplicate fields)
  if (Array.isArray(inv_id)) inv_id = inv_id[0];
  if (Array.isArray(classification_id)) classification_id = classification_id[0];

  // Parse numeric fields
  inv_id = parseInt(inv_id, 10);
  inv_price = parseFloat(inv_price);
  inv_year = parseInt(inv_year, 10);
  inv_miles = parseInt(inv_miles, 10);
  classification_id = parseInt(classification_id, 10);

  try {
    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    );

    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model;
      req.flash("notice", `The ${itemName} was successfully updated.`);
      return res.redirect("/inv/management");
    } else {
      throw new Error("Update failed.");
    }
  } catch (error) {
    // Rebuild classification select for the form
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed: " + error.message);
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
  }
};

module.exports = invCont;