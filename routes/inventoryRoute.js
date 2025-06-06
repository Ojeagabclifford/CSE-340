// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities");
const invController = require("../controllers/invController")
const regValidate = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:inv_id", invController.buildByInventoryId);
router.get("/management", invController.buildBymanagement);



router.get("/addclassification", utilities.handleErrors(invController.buildByAddClassificationId));


router.get("/addinventory",utilities.handleErrors(invController.buildByaddInventory))

router.post("/addclassification",
  regValidate.classificationRules(),
  regValidate.checkclassData,
  utilities.handleErrors(invController.classification)
);


router.post("/addinventory",
  regValidate.addInventoryRules(),
  regValidate.checkinvData,
   utilities.handleErrors(invController.inventory));


module.exports = router;