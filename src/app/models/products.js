const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    sku: {
      type: String,
      // required: false,
    },
    name: {
      type: String,
      // required: false,
    },
    image: {
      type: String,
      default: "",
    },
    cloudinary_id: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      // required: false,
    },
    countInStock: {
      type: Number,
      // required: false,
      min: 0,
      max: 255,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

productSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("products", productSchema);