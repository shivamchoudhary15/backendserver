const express = require('express');
const router = express.Router();
const Pooja = require('../models/pooja');

// Add pooja
router.post('/add', async (req, res) => {
  try {
    const { name, description, itemsRequired, imageUrl } = req.body;
    const pooja = new Pooja({ name, description, itemsRequired, imageUrl });
    await pooja.save();
    res.status(201).json(pooja);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all poojas
router.get('/view', async (req, res) => {
  try {
    const poojas = await Pooja.find();
    res.json(poojas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update pooja
router.put('/update/:id', async (req, res) => {
  try {
    const updated = await Pooja.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Updated successfully', pooja: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete pooja
router.delete('/delete/:id', async (req, res) => {
  try {
    await Pooja.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
