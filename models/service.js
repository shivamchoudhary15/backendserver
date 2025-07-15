// models/service.js
const mongoose = require('mongoose');

const Serviceschema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: String, required: true },
  image: { type: String }, 
});

module.exports = mongoose.model('Service', Serviceschema);
