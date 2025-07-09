const mongoose = require('mongoose');

const PoojaSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  description: { type: String },
  itemsRequired: { type: [String] }, // optional list
});

module.exports = mongoose.model('Pooja', PoojaSchema);
