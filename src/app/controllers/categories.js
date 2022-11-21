const categoryModel = require("../models/categories");

/** Get All*/
const getCategories = async (req, res) => {
    const list = await categoryModel.find();
    if (!list) {
      res.status(500).json({ success: false });
    }
    res.status(200).json(list);
  };

  module.exports = {
    getCategories
};