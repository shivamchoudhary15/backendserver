const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookingSchema = new Schema({
  userid: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  panditid: { type: Schema.Types.ObjectId, ref: 'Pandit', required: true },
  serviceid: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  poojaId: { type: Schema.Types.ObjectId, ref: 'Pooja' }, 
  puja_date: { type: Date, required: true },
  puja_time: { type: String }
});

module.exports = mongoose.model('Booking', BookingSchema);
