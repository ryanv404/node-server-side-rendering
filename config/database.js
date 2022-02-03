const mongoose = require("mongoose");
const {MONGO_URI} = process.env;

exports.connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("[database] Successfully connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};