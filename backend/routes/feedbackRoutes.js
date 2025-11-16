const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// GET all feedbacks
router.get("/", async (req, res) => {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
});

// POST new feedback
router.post("/", async (req, res) => {
    const { username, message } = req.body;
    const feedback = await Feedback.create({ username, message });
    res.json(feedback);
});

// UPVOTE feedback
router.put("/:id/upvote", async (req, res) => {
    const updated = await Feedback.findByIdAndUpdate(
        req.params.id,
        { $inc: { upvotes: 1 } },
        { new: true }
    );
    res.json(updated);
});

module.exports = router;
