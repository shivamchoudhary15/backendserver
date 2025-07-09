const express = require('express');
const router = express.Router();
const Pandit = require('../models/pandit');

// Add new pandit (admin use or testing)
router.post('/add', async (req, res) => {
  try {
    const pandit = new Pandit(req.body);
    await pandit.save();
    res.status(201).json(pandit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// View all pandits
router.get('/view', async (req, res) => {
  try {
    const pandits = await Pandit.find();
    res.json(pandits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Signup as Pandit
router.post('/signup', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    // Basic validation
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ error: 'Name, phone, email, and password are required' });
    }

    // Check if pandit already exists
    const existing = await Pandit.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(409).json({ error: 'Pandit with this email or phone already exists' });
    }

    // Create and save
    const pandit = new Pandit(req.body);
    await pandit.save();
    res.status(201).json({ message: 'Pandit registered successfully', pandit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
