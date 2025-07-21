const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config(); 

const app = express();

// ye miidleware hai 
app.use(cors());
app.use(express.json());

// ✅ ye abhi use nahi kiya 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ MongoDB Connection haya se hoga 
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ DB connection error:', err));

// yaha pe sare routes import ho rahe hai 
const userRoutes = require('./routes/userRoutes');
const panditRoutes = require('./routes/panditRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const poojaRoutes = require('./routes/poojaRoutes');
const locationRoutes = require('./routes/locationRoutes');

// yaha pe routes ko mount kara raha hai 
app.use('/api/users', userRoutes);
app.use('/api/pandits', panditRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/poojas', poojaRoutes);
app.use('/api/locations', locationRoutes);

//  default 
app.get('/', (req, res) => {
  res.send(' Shubkarya API is running...');
});

// ✅ Error  handle hoga 
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: '❌ Invalid JSON' });
  }
  next();
});

//  server started 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
