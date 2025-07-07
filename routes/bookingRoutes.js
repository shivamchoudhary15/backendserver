const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');

// isse booking create hogi
router.post('/create', async (req,res) => {
  try {
    const { userid, panditid, serviceid, puja_date, puja_time, location, SamanList } = req.body;
    
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
    res.status(201).json({ message: 'Booking hogai', booking: savedBooking });
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ error: 'Booking nahi hui. Server error.' });
  }
});

// ise ham sari bookings dekh sakte hai or hamne koi middleware nahi lagaya hua hai tu hai har koi access kar sakta hai
router.get('/view', async (req, res) => {
  try {
    const {userid}=req.query;
    let query = {};
    if (userid){
      query.userid = userid;
    }

    const bookings = await Booking.find(query).populate('panditid serviceid');
    res.status(200).json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to retrieve bookings.' });
  }
});

module.exports = router;







