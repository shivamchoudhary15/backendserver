const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userid: { type: String, required: true },       // Allow dummy user IDs like 'u1'
  panditid: { type: String, required: true },     // Allow dummy pandit IDs like 'p1'
  serviceid: { type: String, required: true },    // Allow dummy service IDs like 's1'
  puja_date: { type: Date, required: true },
  puja_time: { type: String },
  location: { type: String },
  SamanList: { type: String },
  status: { type: String, default: 'Pending' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);

