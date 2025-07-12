const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userid: { type: String, required: true },
  panditid: { type: String, required: true },
  serviceid: { type: String, required: true },
  puja_date: { type: Date, required: true },
  puja_time: { type: String },
  location: { type: String },
  SamanList: { type: String },
  status: { type: String, default: 'Pending' }, // Pending, Accepted, Rejected
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
