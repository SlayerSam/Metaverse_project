const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors'); // Add CORS to handle cross-origin requests

const app = express();
const port = process.env.PORT || 4000; // Use port 4000 for external server

// Enable CORS for all routes
app.use(cors());

// Simple API route on external server
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from external server' });
});

// Set up WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    ws.send('Acknowledged!');
  });
  ws.send('Connected to WebSocket server!');
});

server.listen(port, () => {
  console.log(`External server running on http://localhost:${port}`);
});
