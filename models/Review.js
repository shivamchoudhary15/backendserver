const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  
  comment:{type:String, required: true },
  review_date:{type: Date,default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);
