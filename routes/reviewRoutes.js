const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Submit a new review
router.post('/submit', async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    if (!name || !comment || !rating) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const review = new Review({ name, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error('Review submission error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Get all reviews
router.get('/view', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ review_date: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


