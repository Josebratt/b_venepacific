const productModel = require("../models/products");
const categoryModel = require("../models/categories");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** Get All*/
const getProducts = async (req, res) => {
  const list = await productModel.find().populate("category");
  if (!list) {
    res.status(500).json({ success: false });
  }
  res.status(200).json(list);
};

/** getById */
const getProduct = async (req, res) => {
  const product = await productModel
    .findById(req.params.id)
    .populate("category");

  if (!product) {
    res.status(404).json({ message: "El Id del producto no se ha encontrado" });
  }

  res.status(200).send(product);
};

/** Create */
const createProduct = async (req, res) => {
  const category = await categoryModel.findById(req.body.category);

  if (!category) {
    return res.status(400).send("categoria invalida");
  }

  let fileData = {};
  /** validamos si hay una imagen en el request */
  const file = req.file;
  if (!file) {
    return res.status(400).send("No hay imagen en el request");
  } else {
    let uploadeFile = await cloudinary.uploader.upload(req.file.path, {
      folder: "Venepacific",
      resource_type: "image",
    });

    fileData = {
      fileid: uploadeFile.public_id,
      filePath: uploadeFile.secure_url,
    };
  }

  let product = new productModel({
    sku: req.body.sku,
    name: req.body.name,
    image: fileData.filePath,
    cloudinary_id: fileData.fileid,
    category: req.body.category,
    brand: req.body.brand,
    priceBuy: req.body.priceBuy,
    priceSell: req.body.priceSell,
    countInStock: req.body.countInStock,
  });

  product = await product.save();

  if (!product) return res.status(500).send("El producto no pudo ser creado");

  res.send(product);
};

/** Update */
const updateProduct = async (req, res) => {
  const category = await categoryModel.findById(req.body.category);
  const product = await productModel.findById(req.params.id);

  /** delete image in cloudinary */
  await cloudinary.uploader.destroy(product.cloudinary_id);

  
  if (!category) {
    return res.status(400).send("categoria invalida");
  }

  let fileData;
  if (req.file) {
    fileData = await cloudinary.uploader.upload(req.file.path, {
      folder: "Venepacific",
      resource_type: "image",
    });
  }

  const updatedProduct = await productModel.findByIdAndUpdate(
    req.params.id,
    {
      sku: req.body.sku,
      name: req.body.name,
      cloudinary_id: fileData?.public_id || product.cloudinary_id,
      image: fileData?.secure_url || product.secure_url,
      category: req.body.category,
      countInStock: req.body.countInStock,
    },
    { new: true }
  );

  if (!updatedProduct) {
    return res.status(500).send("El producto no pudo ser actualizado!");
  }

  res.send(updatedProduct);
};

/** Delete */
const deleteProduct = async (req, res) => {
  let product = await productModel.findById(req.params.id);
  await cloudinary.uploader.destroy(product.cloudinary_id);

  productModel
    .findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "El producto fue borrado!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "El producto no fue encontrado!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
