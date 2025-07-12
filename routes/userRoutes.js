const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Pandit = require('../models/pandit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Signup
router.post('/add', async (req, res) => {
  try {
    const { name, email, phone, city, address, password, role } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Please fill all required fields.' });
    }

    const normalizedEmail = email.toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email: normalizedEmail,
      phone,
      city,
      address,
      role: role || 'devotee',
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email, role: savedUser.role },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    );

    const { password: _, ...userData } = savedUser.toObject();
    res.status(201).json({ message: 'User registered successfully', token, user: userData });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let account = await User.findOne({ email: email.toLowerCase() });
    let role;

    if (account) {
      role = account.role; // could be 'admin' or 'devotee'
    } else {
      account = await Pandit.findOne({ email: email.toLowerCase() });
      role = 'pandit';
    }

    if (!account) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    if (role === 'pandit' && !account.is_verified) {
      return res.status(403).json({ error: 'Pandit is not verified by admin yet' });
    }

    const token = jwt.sign(
      { id: account._id, email: account.email, role },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    );

    const { password: _, ...userData } = account.toObject();
    res.json({ message: 'Login successful', token, user: { ...userData, role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Server error.' });
  }
});

// View all users
router.get('/view', async (req, res) => {
  try {
    const users = await User.find().select('-password -__v');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: View all users
router.get('/admin-view', async (req, res) => {
  try {
    const users = await User.find().select('-password -__v');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
