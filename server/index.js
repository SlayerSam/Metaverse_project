require('dotenv').config();
const socketIo = require('socket.io');
const { initializeSocket } = require('./utils/socket');
const { loadData } = require('./database/db');

const io = socketIo(8000, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow your Next.js frontend
    methods: ['GET', 'POST'],
    credentials: true // Optional, set to true if you want to allow cookies
  }
});

console.log('server started')

// Initialize Socket.IO
initializeSocket(io);
loadData()
