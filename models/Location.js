const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false //
  },
  latitude: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Location', locationSchema);
