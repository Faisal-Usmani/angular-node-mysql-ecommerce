const express = require("express");
const productsController = require("../controllers/productsController");
const router = express.Router();

router.get("/", productsController.getProducts);
router.get("/:id", productsController.getProduct);
// router.get("/", productsController.getAllProduct);

module.exports = router;
