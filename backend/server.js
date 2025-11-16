const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/product_feedback") 
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));

// Routes
const feedbackRoutes = require("./routes/feedbackRoutes");
app.use("/api/feedbacks", feedbackRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
