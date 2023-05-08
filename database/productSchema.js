const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const productSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    productName: { type: String, required: true },
    productDescription: { type: String, required: true },
    categorySelector: { type: String, required: true },
    price: { type: Number, required: true },
    inStock: { type: Number, required: true },
    imageURL: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = productSchema;
