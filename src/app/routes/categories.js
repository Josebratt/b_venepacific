const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categories");

/** get all categories */
router.get("/", getCategories);

/** getById Category */
router.get("/:id", getCategory);

/** create category */
router.post("/", createCategory);

/** update category */
router.put("/:id", updateCategory);

/** delete category */
router.delete("/:id", deleteCategory);

module.exports = router;