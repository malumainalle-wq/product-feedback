// backend/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all unique categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// GET products by category
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ msg: "Category query parameter is required." });
    }
    const products = await Product.find({ category: category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;