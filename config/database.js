const mongoose = require("mongoose");
const {MONGO_URI} = process.env;

exports.connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    // ANSI text styling: cyan
    console.log("\x1b[36m%s\x1b[0m", "[database] Successfully connected to DB");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};