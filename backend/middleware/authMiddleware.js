// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json("No token, authorization denied.");

  try {
    const decoded = jwt.verify(token, "YOUR_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json("Token is not valid.");
  }
};