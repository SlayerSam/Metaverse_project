const express = require('express');
const next = require('next');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth.routes');
const roomRoutes = require('./routes/roomRoutes');
const { initializeSocket } = require('./utils/socket');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = socketIo(httpServer);

  // Initialize WebSocket
  initializeSocket(io);

  // Middleware for parsing JSON
  server.use(express.json());

  // API Routes
  server.use('/api/auth', authRoutes);
  server.use('/api/rooms', roomRoutes);

  // Next.js catch-all route
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
