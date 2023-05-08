// schema => define field => generate model => use model => query, insert, delete, update
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    userSelector: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = userSchema;

/*
id: {
    type: String,
    required: true,
  },
*/
