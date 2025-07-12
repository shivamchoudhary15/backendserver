const express = require('express');
const router = express.Router();
const Pandit = require('../models/pandit');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ✅ Pandit Signup Route
router.post('/signup', async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      city,
      experienceYears,
      languages,
      specialties,
      bio,
      profile_photo_url
    } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ error: 'Please fill all required fields.' });
    }

    const existing = await Pandit.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPandit = new Pandit({
      name,
      phone,
      email: email.toLowerCase(),
      password: hashedPassword,
      city,
      experienceYears,
      languages,
      specialties,
      bio,
      profile_photo_url
    });

    await newPandit.save();

    res.status(201).json({ message: 'Pandit registered. Awaiting admin verification.' });
  } catch (err) {
    console.error('Pandit signup error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ✅ Pandit Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const pandit = await Pandit.findOne({ email: email.toLowerCase() });

    if (!pandit) {
      return res.status(401).json({ error: 'Pandit not found.' });
    }

    const isMatch = await bcrypt.compare(password, pandit.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    if (!pandit.is_verified) {
      return res.status(403).json({ error: 'Pandit not verified by admin.' });
    }

    const token = jwt.sign({ id: pandit._id, role: 'pandit' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ token, user: pandit });
  } catch (err) {
    console.error('Pandit login error:', err);
    res.status(500).json({ error: 'Login failed. Try again.' });
  }
});

// ✅ Get all verified Pandits
router.get('/view', async (req, res) => {
  try {
    const pandits = await Pandit.find({ is_verified: true });
    res.json(pandits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin: Get all Pandits (verified + unverified)
router.get('/admin-view', async (req, res) => {
  try {
    const pandits = await Pandit.find();
    res.json(pandits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin: Verify Pandit by ID
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
