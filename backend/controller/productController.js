const Product = require("../model/productModel");

const createProduct = async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;
  if (!name || !category || !quantity || !price || !description) {
    res.status(400).json("Please fill in all fields");
  }
  fileData = {};
  if (req.file) {
    fileData = {
      fileName: req.file.originalName,
      filePath: req.file.path,
      fileType: req.file.mimetype,
    };
  }
  try {
    const product = await Product.create({
      user: req.user.id,
      name: name,
      sku: sku,
      category: category,
      quantity: quantity,
      price: price,
      description: description,
      image: fileData,
    });
    res.status(201).json(product);
  } catch (error) {
    res.json(error.message);
  }
};
module.exports = {
  createProduct,
};
