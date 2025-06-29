const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

router.post('/send', async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;




