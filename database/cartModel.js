const mongoose = require("mongoose");

const cartSchema = require("./cartSchema");

const cartModel = mongoose.model("userCart", cartSchema);
module.exports = cartModel;
