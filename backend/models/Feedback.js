const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Feedback", FeedbackSchema);
