const express = require('express');
const router = express.Router();
const Pandit = require('../models/pandit');

// View all
router.get('/view', async (req, res) => {
  try {
    const pandits = await Pandit.find({ is_verified: true }); // only verified
    res.json(pandits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get all (including unverified)
router.get('/admin-view', async (req, res) => {
  try {
    const pandits = await Pandit.find();
    res.json(pandits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Verify Pandit
router.put('/verify/:id', async (req, res) => {
  try {
    const updated = await Pandit.findByIdAndUpdate(
      req.params.id,
      { is_verified: true },
      { new: true }
    );
    res.json({ message: 'Pandit verified', pandit: updated });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router;
