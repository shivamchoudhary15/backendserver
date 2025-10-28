const express = require('express');
const http = require('http');                  // Required to create HTTP server
const { Server } = require('socket.io');       // Socket.IO server
const mongoose = require('mongoose');        // to connect to mongoose
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
//const server = http.createServer(app);        

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "https://backendserver-1-zr4c.onrender.com",        // Replace '*' with your frontend URL in production for security
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB using your .env connection string
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ DB connection error:', err));

// Import routes as before (no changes here)
const userRoutes = require('./routes/userRoutes');
const panditRoutes = require('./routes/panditRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const poojaRoutes = require('./routes/poojaRoutes');
const locationRoutes = require('./routes/locationRoutes');

// Mount your routes
app.use('/api/users', userRoutes);
app.use('/api/pandits', panditRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/poojas', poojaRoutes);
app.use('/api/locations', locationRoutes);

// Default root endpoint
app.get('/', (req, res) => {
  res.send('Shubkarya API is running...');
});

// Error handling middleware for invalid JSON
app.use((err, req, res, next) => {
  if(err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: '❌ Invalid JSON' });
  }
  next();
});

// Socket.IO logic for real-time chat connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room identified by userId_panditId string
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Broadcast received messages to all clients in that room
  socket.on('sendMessage', (data) => {
    // Data format expected: { roomId, senderId, message, timestamp }
    io.to(data.roomId).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server using the HTTP server instance for socket.io compatibility
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
