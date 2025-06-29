const express = require('express');
const router = express.Router();
const Pandit = require('../models/pandit');

router.post('/add', async (req, res) => {
  try {
    const pandit = new Pandit(req.body);
    await pandit.save();
    res.status(201).json(pandit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/view', async (req, res) => {
  try {
    const pandits = await Pandit.find();
    res.json(pandits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});router.get('/view', async (req, res) => {
  try {
    const pandits = await Pandit.find();
    res.json(pandits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
