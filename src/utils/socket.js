import { Server } from 'socket.io';

let io;

export function initializeSocket(server) {
  if (!io) {
    io = new Server(server);

    io.on('connection', (socket) => {
      console.log('New client connected', socket.id);

      socket.on('joinRoom', (room) => {
        socket.join(room);
        socket.to(room).emit('userJoined', { userId: socket.id });
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
      });
    });
  }

  return io;
}