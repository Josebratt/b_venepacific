const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");

const {
  searchByText,
  getProducts, 
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  featuredProducts,
  onSaleProducts
} = require("../controllers/products");

/** get all Products */
router.get("/", getProducts);

/** getById Product */
router.get("/:id", getProduct);

/** create Product */
router.post("/", upload.single("image"), createProduct);

/** update Product */
router.put("/:id", upload.single("image"), updateProduct);

/**
 * gets products by name
 */
router.get("/search/:text", searchByText)

/** delete Product */
router.delete("/:id", deleteProduct);

/** featured Products */
router.get("/featured/:count", featuredProducts);

/**
 * On Sale Products Route
 */
router.get("/onsale/:count", onSaleProducts);

module.exports = router;