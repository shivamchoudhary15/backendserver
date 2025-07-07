const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// user signup ke liye 
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
      role: role || 'user',
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

// user login ke liye
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    );

    const { password: _, ...userData } = user.toObject();
    res.json({ message: 'Login successful', token, user: userData });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Server error.' });
  }
});

//  sare authorized user ko dekne ke liye
router.get('/view', async (req, res) => {
  try {
    const users = await User.find().select('-password -__v');
    res.status(200).json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;







