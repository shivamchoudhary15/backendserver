const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Booking = require('../models/booking');

// yaha pe booking create hogi
router.post('/create', async (req, res) => {
  try {
    const {
      userid,
      panditid,
      serviceid,
      puja_date,
      puja_time,
      location,
      SamanList,
      poojaId
    } = req.body;

    const userObjId = new mongoose.Types.ObjectId(userid);
    const panditObjId = new mongoose.Types.ObjectId(panditid);
    const poojaObjId = poojaId ? new mongoose.Types.ObjectId(poojaId) : undefined;

    // ise double booking prevent hogi 
    const existing = await Booking.findOne({
      panditid: panditObjId,
      puja_date: new Date(puja_date),
      status: { $in: ['Pending', 'Accepted'] }
    });

    if (existing) {
      return res.status(409).json({ error: 'Pandit already booked on this date' });
    }

    const booking = new Booking({
      userid: userObjId,
      panditid: panditObjId,
      serviceid,
      poojaId: poojaObjId,
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

// booking get hogi 
router.get('/view', async (req, res) => {
  try {
    const { userid, panditid } = req.query;
    let query = {};

    if (userid) query.userid = new mongoose.Types.ObjectId(userid);
    if (panditid) query.panditid = new mongoose.Types.ObjectId(panditid);

    const bookings = await Booking.find(query)
      .populate('panditid', 'name')
      .populate('poojaId', 'name')
      .populate('serviceid', 'name')
      .populate('userid', 'name email phone');  // ✅ include phone here

    res.status(200).json(bookings);
  } catch (err) {
    console.error('Booking fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
});

// ye optoinal ye booking update ke liye
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

// ek particular user ki sari bookings aa jayegi 
router.get('/user/:userid', async (req, res) => {
  try {
    const userObjId = new mongoose.Types.ObjectId(req.params.userid);
    const bookings = await Booking.find({ userid: userObjId })
      .populate('poojaId', 'name')
      .populate('panditid', 'name')
      .populate('serviceid', 'name')
      .populate('userid', 'name email phone'); 

    res.json(bookings);
  } catch (err) {
    console.error('User booking fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch user bookings' });
  }
});

module.exports = router;
