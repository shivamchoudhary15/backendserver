const mongoose=require('mongoose');

const Serviceschema=new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name:{type:String,required:true },
  description:{type:String },
  price:{ type:Number, required:true }
});

module.exports = mongoose.model('Service', Serviceschema);
