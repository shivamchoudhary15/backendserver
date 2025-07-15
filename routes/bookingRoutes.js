const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');

// ✅ Create booking
router.post('/create', async (req, res) => {
  try {
    const { userid, panditid, serviceid, puja_date, puja_time, location, SamanList, poojaId } = req.body;

    // Check for booking conflict
    const existing = await Booking.findOne({
      panditid,
      puja_date: new Date(puja_date),
      status: { $in: ['Pending', 'Accepted'] }
    });

    if (existing) {
      return res.status(409).json({ error: 'Pandit already booked on this date' });
    }

    // Save booking
    const booking = new Booking({
      userid,
      panditid,
      serviceid,
      poojaId,        // Include poojaId if applicable
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

// ✅ Get bookings by user or pandit, with populated references
router.get('/view', async (req, res) => {
  try {
    const { userid, panditid } = req.query;
    let query = {};
    if (userid) query.userid = userid;
    if (panditid) query.panditid = panditid;

    const bookings = await Booking.find(query)
      .populate('panditid', 'name')        // Only get pandit name
      .populate('serviceid', 'name')       // Only get service name
      .populate('poojaId', 'name');        // Optional: populate pooja name if using poojaId

    res.status(200).json(bookings);
  } catch (err) {
    console.error('Booking fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
});

// ✅ Update booking status (Pandit use)
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
    console.error('Booking status update error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// GET all bookings for a specific user
router.get('/user/:userid', async (req, res) => {
  try {
    const bookings = await Booking.find({ userid: req.params.userid })
      .populate('poojaId')
      .populate('panditid');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user bookings' });
  }
});


module.exports = router;
