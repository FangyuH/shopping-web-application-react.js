//mongodb+srv://fh2440:<password>@cluster0.vliueep.mongodb.net/?retryWrites=true&w=majority

const mongoose = require("mongoose");
const connectionStr =
  "mongodb+srv://fh2440:itKjXp.-27e7PCf@cluster0.vliueep.mongodb.net/chuwaproject?retryWrites=true&w=majority";

const connectToMongoose = () => {
  mongoose.connect(connectionStr);

  const db = mongoose.connection;
  db.on("error", console.error.bind(console), "connection error");
  db.on("open", () => {
    console.log("connect to mongodb");
  });
};

module.exports = connectToMongoose;
