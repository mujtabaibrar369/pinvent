const dotenv = require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const path = require("path");
const cors = require("cors");
const connectDB = require("./configuration/connectDB");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "uploads")));
const PORT = process.env.PORT || 5000;
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.get("/", (req, res) => {
  res.send("Home Page");
});
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();
