const mongoose = require("mongoose");

const productSchema = require("./productSchema");

const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
