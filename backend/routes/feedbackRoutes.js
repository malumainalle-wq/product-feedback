// backend/routes/feedbackRoutes.js
const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const auth = require("../middleware/authMiddleware");

// GET all feedbacks (NOW WITH FILTERING AND POPULATE)
router.get("/", async (req, res) => {
    const { page = 1, limit = 10, category, rating } = req.query;

    let filters = {};
    if (category) filters.category = category;
    if (rating) filters.rating = rating;

    try {
      const feedbacks = await Feedback.find(filters)
          // <-- MODIFIED: Also populate imageUrl -->
          .populate('product', 'name imageUrl') 
          .sort({ createdAt: -1 })
          .limit(limit * 1)
          .skip((page - 1) * limit);

      const count = await Feedback.countDocuments(filters);
      
      res.json({
          feedbacks,
          totalPages: Math.ceil(count / limit),
          currentPage: page
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server Error" });
    }
});

// GET stats for admin dashboard
// ... (this route remains the same)
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
    const { username, message, rating, product, category } = req.body;
    const feedback = await Feedback.create({ username, message, rating, product, category });
    
    // <-- MODIFIED: Also populate imageUrl -->
    const newFeedback = await Feedback.findById(feedback._id).populate('product', 'name imageUrl');
    res.json(newFeedback);
});

// EDIT feedback (Protected)
router.put("/:id", auth, async (req, res) => {
  const { username, message, rating, product, category } = req.body;
  const updated = await Feedback.findByIdAndUpdate(
    req.params.id,
    { username, message, rating, product, category },
    { new: true }
    // <-- MODIFIED: Also populate imageUrl -->
  ).populate('product', 'name imageUrl');
  res.json(updated);
});

// DELETE feedback (Protected)
// ... (this route remains the same)
router.delete("/:id", auth, async (req, res) => {
  await Feedback.findByIdAndDelete(req.params.id);
  res.json({ msg: "Feedback deleted" });
});

module.exports = router;