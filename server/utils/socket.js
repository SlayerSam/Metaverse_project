function initializeSocket(io) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('joinRoom', (room) => {
            socket.join(room);
            console.log(`User ${socket.id} joined room ${room}`);
        });

        socket.on('message', (msg) => {
            const room = msg.room;
            io.to(room).emit('message', msg);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}

module.exports = { initializeSocket };
