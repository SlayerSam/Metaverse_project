const { createRoom, fetchRooms, joinRoom } = require("../controllers/room.controller");
const { avatarStore } = require('../controllers/user.controller')


function initializeSocket(io) {
    io.on('connection', (socket) => {
        console.log('New client connected');

        // WebSocket message handler
        socket.on('message', async (message) => {
            const { action, userId, roomId, avatarData } = JSON.parse(message);

            switch (action) {
                case 'createRoom':
                    const roomData = await createRoom();
                    socket.send(JSON.stringify({ action: 'roomCreated', roomData }));
                    break;

                case 'fetchRooms':
                    const rooms = await fetchRooms();
                    socket.send(JSON.stringify({ action: 'roomsFetched', rooms }));
                    break;

                case 'joinRoom':
                    try {
                        const updatedRoomData = await joinRoom(roomId, userId);
                        socket.send(JSON.stringify({ action: 'roomJoined', roomId, updatedRoomData }));
                    } catch (error) {
                        socket.send(JSON.stringify({ action: 'error', message: error.message }));
                    }
                    break;
                case 'avatarStore':
                    try {
                        await avatarStore(avatarData).then(() => {
                            socket.send(JSON.stringify({ action: 'avatarStored' }));
                        })
                    }
                    catch (error) {
                        socket.send(JSON.stringify({ action: 'error', message: error.message }));
                    }
                default:
                    socket.send(JSON.stringify({ action: 'error', message: 'Unknown action' }));
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
}

module.exports = { initializeSocket };
