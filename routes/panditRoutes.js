const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Pandit = require('../models/pandit');
const upload = require('../config/multer'); // ✅ Import multer from config

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
      languages: Array.isArray(languages) ? languages.map(l => l.trim()) : [],
      specialties: Array.isArray(specialties) ? specialties.map(s => s.trim()) : [],
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

// ✅ Upload Pandit Profile Photo
router.post('/upload/:id', upload.single('photo'), async (req, res) => {
  try {
    const filePath = `/uploads/pandits/${req.file.filename}`;
    const pandit = await Pandit.findByIdAndUpdate(
      req.params.id,
      { profile_photo_url: filePath },
      { new: true }
    );

    if (!pandit) {
      return res.status(404).json({ error: 'Pandit not found' });
    }

    res.json({
      message: 'Profile photo uploaded successfully',
      profile_photo_url: filePath,
      pandit,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
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

// ✅ Get all verified Pandits (for public/home)
router.get('/view', async (req, res) => {
  try {
    const pandits = await Pandit.find({ is_verified: true });
    res.json(pandits);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pandits.' });
  }
});

// ✅ Admin: Get all Pandits (verified + unverified)
router.get('/admin-view', async (req, res) => {
  try {
    const pandits = await Pandit.find();
    res.json(pandits);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all pandits.' });
  }
});

// ✅ Admin: Verify a Pandit
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

// ✅ Get single Pandit by ID
router.get('/:id', async (req, res) => {
  try {
    const pandit = await Pandit.findById(req.params.id);
    if (!pandit) return res.status(404).json({ error: 'Pandit not found.' });
    res.json(pandit);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pandit.' });
  }
});

module.exports = router;
