// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// --- You might run this once to create your admin ---
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashedPassword });
  res.json(user);
});

// --- This is your main login route ---
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json("Invalid credentials");

  const token = jwt.sign({ id: user._id }, "YOUR_SECRET_KEY", { expiresIn: "1d" });
  res.json({ token, user: { id: user._id, username: user.username } });
});

module.exports = router;