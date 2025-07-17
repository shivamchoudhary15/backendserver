const mongoose = require('mongoose');

const PoojaSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String }, // isme image url ayegi 
  itemsRequired: { type: [String] }, 
});

module.exports = mongoose.model('Pooja', PoojaSchema);
