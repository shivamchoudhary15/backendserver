const mongoose=require('mongoose');

const Userschema=new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name:{type:String, required:true},
  email:{type:String, required:true,unique:true},
  phone:{type: String,required: true, unique:true},
  city:{type:String},
  address: {type:String},
  password:{type: String,required:true,min:8,max:64},
});

module.exports = mongoose.model('User', Userschema);
