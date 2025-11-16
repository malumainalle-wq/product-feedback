// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path'); // <-- ADD THIS

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/product_feedback") 
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));

// Routes
app.use("/api/feedbacks", require("./routes/feedbackRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes")); // <-- ADD THIS

// --- Serve Frontend Static Files ---
// (This is the code from our previous conversation, make sure it's here)
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});
// ------------------------------------

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));