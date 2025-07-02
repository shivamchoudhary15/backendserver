const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');

// ===================== CREATE BOOKING (Now Public) =====================
router.post('/create', async (req, res) => {
  try {
    const { userid, panditid, serviceid, puja_date, puja_time, location, SamanList } = req.body;

    // Validate required fields
    if (!userid || !panditid || !serviceid || !puja_date || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
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
    res.status(201).json({ message: 'Booking created successfully', booking: savedBooking });
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ error: 'Booking failed. Server error.' });
  }
});

// ===================== GET USER'S BOOKINGS (Now Public) =====================
router.get('/view', async (req, res) => {
  try {
    const { userid } = req.query;

    if (!userid) {
      return res.status(400).json({ error: 'Missing userid in query' });
    }

    const bookings = await Booking.find({ userid }).populate('panditid serviceid');
    res.status(200).json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to retrieve bookings.' });
  }
});

module.exports = router;







