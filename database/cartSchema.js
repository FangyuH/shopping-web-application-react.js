const mongoose = require("mongoose");
//const { v4: uuidv4 } = require("uuid");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    items: [
      {
        productId: String,
        productName: String,
        price: Number,
        quantity: Number,
        imageURL: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = cartSchema;
