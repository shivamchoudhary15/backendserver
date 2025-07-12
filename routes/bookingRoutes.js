const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');

// Create booking
router.post('/create', async (req, res) => {
  try {
    const { userid, panditid, serviceid, puja_date, puja_time, location, SamanList } = req.body;

    const existing = await Booking.findOne({
      panditid,
      puja_date: new Date(puja_date),
      status: { $in: ['Pending', 'Accepted'] }
    });

    if (existing) {
      return res.status(409).json({ error: 'Pandit already booked on this date' });
    }

    const booking = new Booking({
      userid,
      panditid,
      serviceid,
      puja_date,
      puja_time,
      location,
      SamanList
    });

    const savedBooking = await booking.save();
    res.status(201).json({ message: 'Booking created', booking: savedBooking });
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all or by user or pandit
router.get('/view', async (req, res) => {
  try {
    const { userid, panditid } = req.query;
    let query = {};
    if (userid) query.userid = userid;
    if (panditid) query.panditid = panditid;

    const bookings = await Booking.find(query).populate('panditid serviceid');
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
});

// Update booking status (Pandit use)
router.put('/status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ message: 'Status updated', booking: updated });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;
