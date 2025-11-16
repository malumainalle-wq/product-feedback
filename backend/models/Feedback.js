// models/Feedback.js
const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }, // <-- CHANGED
}, { timestamps: true });

module.exports = mongoose.model("Feedback", FeedbackSchema);