const mongoose = require("mongoose");
const userSchema = require("./schema");

const userModel = mongoose.model("userInfo", userSchema);

module.exports = userModel;
