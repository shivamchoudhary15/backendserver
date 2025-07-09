const express = require('express');
const router = express.Router();
const Pooja = require('../models/pooja');

// Add a new pooja
router.post('/add', async (req, res) => {
  try {
    const pooja = new Pooja(req.body);
    await pooja.save();
    res.status(201).json(pooja);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// View all poojas
router.get('/view', async (req, res) => {
  try {
    const poojas = await Pooja.find();
    res.status(200).json(poojas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
