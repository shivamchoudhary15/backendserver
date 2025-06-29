const mongoose=require('mongoose');

const NotificationSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  user_id:{ type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  message:{ type: String },
  is_read:{ type: Boolean, default: false },
  created_at:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
