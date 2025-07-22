const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  name:{type:String,required:true },
  rating:{type:Number,min:1,max:5,required: true },
  comment:{type:String, required: true },
  review_date:{type: Date,default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);
