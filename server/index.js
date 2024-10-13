require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import CORS if needed
const { initializeSocket } = require('./utils/socket');
const authRoutes = require('./routes/auth.routes')

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow your Next.js frontend
    methods: ['GET', 'POST'],
    credentials: true // Optional, set to true if you want to allow cookies
  }
});
// Optional: Use CORS if your Next.js app is on a different origin
// Enable CORS for Express routes
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST'],
  credentials: true // Optional, set to true if you want to allow cookies
}));

// Middleware for parsing JSON
app.use(express.json());

// Initialize Socket.IO
initializeSocket(io);


app.use('/api/v1/auth', authRoutes)

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
