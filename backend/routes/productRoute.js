const express = require("express");
const router = express.Router();

const { createProduct } = require("../controller/productController");
const protect = require("../middleware/authMiddleware");
const { upload } = require("../utils/fileUpload");
router.post("/createProduct", protect, upload.single("image"), createProduct);
module.exports = router;
