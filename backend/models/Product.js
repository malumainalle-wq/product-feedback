// backend/models/Product.js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  // Add the new field
  imageUrl: { type: String }
});

module.exports = mongoose.model("Product", ProductSchema);