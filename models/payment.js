const mongoose=require('mongoose');

const PaymentSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  booking_id: { type: mongoose.Schema.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  payment_method: { type: String, enum: ['UPI','Card','Cash'], required: true },
  payment_status: { type: String, enum: ['Paid','Pending','Failed'], default:'Pending'},
  payment_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);
