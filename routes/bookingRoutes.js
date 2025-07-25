const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Booking = require('../models/booking');
const Pandit = require('../models/pandit');       // Import Pandit model
const nodemailer = require('nodemailer');
require('dotenv').config();                       // Load .env variables

// Setup nodemailer transporter with env credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Booking creation route
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

    // Prevent double booking
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

    // Send notification email to pandit
    try {
      const pandit = await Pandit.findById(panditObjId);

      if (pandit && pandit.email) {
        // You can customize userName extraction if you store user details differently
        const userName = req.body.userName || 'A user';

        const mailOptions = {
          from: process.env.MAIL_USER,
          to: pandit.email,
          subject: 'New Pandit Booking Received',
          text: `Hello Pandit,

You have a new booking from ${userName}.
Date: ${savedBooking.puja_date}
Time: ${savedBooking.puja_time}

Please check your dashboard for details.

Thank you.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending booking notification email:', error);
          } else {
            console.log('Booking notification email sent:', info.response);
          }
        });
      } else {
        console.log('Pandit not found or has no email for ID:', panditObjId);
      }
    } catch (emailErr) {
      console.error('Error while sending email:', emailErr);
    }

    res.status(201).json({ message: 'Booking created', booking: savedBooking });
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Booking fetch route
// Replace your current GET /view implementation with:

router.get('/view', async (req, res) => {
  try {
    const { userid, panditid } = req.query;
    let query = {};

    if (userid) query.userid = new mongoose.Types.ObjectId(userid);
    if (panditid) query.panditid = new mongoose.Types.ObjectId(panditid);

    // Find and populate references
    const bookings = await Booking.find(query)
      .populate('panditid', 'name')
      .populate('poojaId', 'name')
      .populate('serviceid', 'name')
      .populate('userid', 'name email phone');

    // Map to add panditName and devoteeName fields
    const bookingsWithNames = bookings.map(b => {
      const obj = b.toObject();
      return {
        ...obj,
        panditName: obj.panditid ? obj.panditid.name : 'Unknown Pandit',
        devoteeName: obj.userid ? obj.userid.name : 'Unknown Devotee',
      };
    });

    res.status(200).json(bookingsWithNames);
  } catch (err) {
    console.error('Booking fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
});


// Booking status update route
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

// Get bookings for a specific user
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
