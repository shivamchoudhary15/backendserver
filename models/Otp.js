// models/Otp.js
const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('Otp', OtpSchema);
