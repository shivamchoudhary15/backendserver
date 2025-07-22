const express = require('express');
const http = require('http');                  // Add this
const { Server } = require('socket.io');       // Add this
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);         // Use HTTP server
const io = new Server(server, {
  cors: {
    origin: "*",        // In production, replace '*' with your frontend domain
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ DB connection error:', err));

/* your routes imports and mounting here */
const userRoutes = require('./routes/userRoutes');
const panditRoutes = require('./routes/panditRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const poojaRoutes = require('./routes/poojaRoutes');
const locationRoutes = require('./routes/locationRoutes');

app.use('/api/users', userRoutes);
app.use('/api/pandits', panditRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/poojas', poojaRoutes);
app.use('/api/locations', locationRoutes);

app.get('/', (req, res) => {
  res.send('Shubkarya API is running...');
});

app.use((err, req, res, next) => {
  if(err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: '❌ Invalid JSON' });
  }
  next();
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a unique room for user-pandit pair chat (roomId format: userId_panditId)
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Receive message from client and broadcast to the room
  socket.on('sendMessage', (data) => {
    // data must contain: roomId, senderId, message, timestamp
    io.to(data.roomId).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
