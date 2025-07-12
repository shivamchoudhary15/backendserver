const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const Pandit = require('../models/pandit');

// Multer setup for photo upload (admin upload from dashboard)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/pandits/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `pandit-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// ✅ Pandit Signup
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
      profile_photo_url,
    } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ error: 'Please fill all required fields.' });
    }

    const existing = await Pandit.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPandit = new Pandit({
      name: name.trim(),
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      city: city?.trim() || '',
      experienceYears: experienceYears || 0,
      languages: Array.isArray(languages)
        ? languages.map(l => l.trim().toLowerCase())
        : [],
      specialties: Array.isArray(specialties)
        ? specialties.map(s => s.trim())
        : [],
      bio: bio?.trim() || '',
      profile_photo_url: profile_photo_url || '',
    });

    await newPandit.save();
    res.status(201).json({ message: 'Pandit registered. Awaiting admin verification.' });
  } catch (err) {
    console.error('Pandit signup error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ✅ Pandit Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });

    const pandit = await Pandit.findOne({ email: email.toLowerCase().trim() });

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

// ✅ Get all verified Pandits (Public)
router.get('/view', async (req, res) => {
  try {
    const pandits = await Pandit.find({ is_verified: true });
    res.json(pandits);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch pandits.' });
  }
});

// ✅ Get single Pandit by ID (optional)
router.get('/:id', async (req, res) => {
  try {
    const pandit = await Pandit.findById(req.params.id);
    if (!pandit) return res.status(404).json({ error: 'Pandit not found.' });
    res.json(pandit);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pandit.' });
  }
});

// ✅ Admin: Get all Pandits (Verified + Unverified)
router.get('/admin-view', async (req, res) => {
  try {
    const pandits = await Pandit.find();
    res.json(pandits);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch all pandits.' });
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
    if (!updated) {
      return res.status(404).json({ error: 'Pandit not found.' });
    }
    res.json({ message: 'Pandit verified successfully.', pandit: updated });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed.' });
  }
});

// ✅ Admin: Upload Pandit Photo
router.post('/upload/:id', upload.single('photo'), async (req, res) => {
  try {
    const imagePath = `/uploads/pandits/${req.file.filename}`;
    const updated = await Pandit.findByIdAndUpdate(
      req.params.id,
      { profile_photo_url: imagePath },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Pandit not found.' });
    res.json({ message: 'Profile photo uploaded.', pandit: updated });
  } catch (err) {
    console.error('Photo upload error:', err);
    res.status(500).json({ error: 'Upload failed.' });
  }
});

module.exports = router;
