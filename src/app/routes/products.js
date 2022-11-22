const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");

const {
  getProducts, 
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/products");

/** get all categories */
router.get("/", getProducts);

/** getById Category */
router.get("/:id", getProduct);

/** create Product */
router.post("/", upload.single("image"), createProduct);

/** update Product */
router.put("/:id", updateProduct);

/** delete Product */
router.delete("/:id", deleteProduct);

module.exports = router;