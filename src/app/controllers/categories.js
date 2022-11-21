const categoryModel = require("../models/categories");

/** Get All*/
const getCategories = async (req, res) => {
  const list = await categoryModel.find();
  if (!list) {
    res.status(500).json({ success: false });
  }
  res.status(200).json(list);
};

/** getById */
const getCategory = async (req, res) => {
  const category = await categoryModel.findById(req.params.id);

  if (!category) {
    res
      .status(500)
      .json({ message: "El Id de la categoria no se ha encontrado" });
  }

  res.status(200).send(category);
};

/** Create */
const createCategory = async (req, res) => {
  let category = new categoryModel({
    name: req.body.name,
  });

  category = await category.save();

  if (!category)
    return res.status(400).send("La categoria no pudo ser creada!");

  res.send(category);
};

/** Update */
const updateCategory = async (req, res) => {
  const category = await categoryModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  if (!category)
    return res.status(400).send("La categoria no pudo ser actualizada!");

  res.send(category);
};

/** Delete */
const deleteCategory = (req, res) => {
  categoryModel
    .findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "La categoria fue borrada!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "La categoria no fue encontrada!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
