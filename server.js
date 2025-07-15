const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// ✅ Load environment variables
dotenv.config(); // If you want to suppress dotenv info logs, use dotenv@16.x

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Static folder for image uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ MongoDB Connection (removed deprecated options)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ DB connection error:', err));

// ✅ Import routes
const userRoutes = require('./routes/userRoutes');
const panditRoutes = require('./routes/panditRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const poojaRoutes = require('./routes/poojaRoutes');

// ✅ Mount routes
app.use('/api/users', userRoutes);
app.use('/api/pandits', panditRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/poojas', poojaRoutes);

// ✅ Health check / root route
app.get('/', (req, res) => {
  res.send('🕉️ Shubkarya API is running...');
});

// ✅ Error handling for malformed JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: '❌ Invalid JSON' });
  }
  next();
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
