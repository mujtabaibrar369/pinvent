const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.Mongo_URI);
    console.log(`monodb connected at: ${connect.connection.host}`);
  } catch (error) {
    console.log("error connecting to db");
    console.log(error);
    process.exit(1);
  }
};
module.exports = connectDB;
