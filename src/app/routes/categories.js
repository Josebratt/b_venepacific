const express = require("express");
const router = express.Router();
const {
  getCategories
} = require("../controllers/categories");

/** get all categories */
router.get("/", getCategories);


module.exports = router;