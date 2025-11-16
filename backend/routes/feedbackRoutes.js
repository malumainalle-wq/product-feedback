// routes/feedbackRoutes.js
const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const auth = require("../middleware/authMiddleware"); // <-- Import auth

// GET all feedbacks (Add Pagination)
router.get("/", async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const feedbacks = await Feedback.find()
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const count = await Feedback.countDocuments();
    res.json({
        feedbacks,
        totalPages: Math.ceil(count / limit),
        currentPage: page
    });
});

// GET stats for admin dashboard
router.get("/stats", async (req, res) => {
  try {
    const totalFeedbacks = await Feedback.countDocuments();
    const avgRatingResult = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);
    const avgRating = avgRatingResult[0]?.avgRating || 0;

    res.json({ totalFeedbacks, avgRating: avgRating.toFixed(1) });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// POST new feedback
router.post("/", async (req, res) => {
    // Now includes rating
    const { username, message, rating } = req.body;
    const feedback = await Feedback.create({ username, message, rating });
    res.json(feedback);
});

// EDIT feedback (Protected)
router.put("/:id", auth, async (req, res) => {
  const { username, message, rating } = req.body;
  const updated = await Feedback.findByIdAndUpdate(
    req.params.id,
    { username, message, rating },
    { new: true }
  );
  res.json(updated);
});

// DELETE feedback (Protected)
router.delete("/:id", auth, async (req, res) => {
  await Feedback.findByIdAndDelete(req.params.id);
  res.json({ msg: "Feedback deleted" });
});

module.exports = router;