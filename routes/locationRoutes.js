const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// POST /api/locations
router.post('/', async (req, res) => {
  try {
    const { latitude, longitude, userId } = req.body;
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ error: 'Latitude and longitude are required and must be numbers.' });
    }

    const newLocation = new Location({
      latitude,
      longitude,
      userId: userId || null
    });

    await newLocation.save();
    res.status(201).json({ success: true, message: 'Location stored successfully.' });
  } catch (error) {
    console.error('Location POST error:', error);
    res.status(500).json({ error: 'Failed to store location.' });
  }
});

// GET /api/locations (for admin/debug: get all locations, optionally filter by user)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const locations = await Location.find(filter).sort({ timestamp: -1 });
    res.json(locations);
  } catch (error) {
    console.error('Location GET error:', error);
    res.status(500).json({ error: 'Failed to get locations.' });
  }
});

module.exports = router;
