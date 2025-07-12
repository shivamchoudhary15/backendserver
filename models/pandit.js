const mongoose = require('mongoose');

const Panditschema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  city: { type: String },
  experienceYears: { type: Number },
  languages: { type: String },
  specialties: { type: String },
  bio: { type: String },
  profile_photo_url: { type: String },
  is_verified: { type: Boolean, default: false },
  password: { type: String, required: true, min: 8, max: 8 },
  role: {
    type: String,
    enum: ['pandit'],
    default: 'pandit',
  }
});

module.exports = mongoose.model('Pandit', Panditschema);
