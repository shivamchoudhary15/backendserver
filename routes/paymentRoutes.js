const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');

// abhi use  nahi kar rahe ye payment create karne ke liye use hoga 
router.post('/pay', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/view', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

