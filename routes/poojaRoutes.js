const express = require('express');
const router = express.Router();
const Pooja = require('../models/pooja');

// pooja add hogi 
router.post('/add', async (req, res) => {
  try {
    const { name, description, itemsRequired = [], imageUrl = '' } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required.' });
    }

    const pooja = new Pooja({
      name,
      description,
      itemsRequired: Array.isArray(itemsRequired) ? itemsRequired : [],
      imageUrl,
    });

    await pooja.save();
    res.status(201).json(pooja);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to add pooja' });
  }
});

// get karenge sare poojas 
router.get('/view', async (req, res) => {
  try {
    const poojas = await Pooja.find();
    res.json(poojas);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch poojas' });
  }
});

// 🔹 Update karenge pooja ko by id 
router.put('/update/:id', async (req, res) => {
  try {
    const updated = await Pooja.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Pooja not found.' });
    res.json({ message: 'Updated successfully', pooja: updated });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Update failed' });
  }
});

//  Delete karenge pooja by id
router.delete('/delete/:id', async (req, res) => {
  try {
    const deleted = await Pooja.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Pooja not found.' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Delete failed' });
  }
});

module.exports = router;
