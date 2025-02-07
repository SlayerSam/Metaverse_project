const { buyProduct } = require("../controllers/product.controller");
const { createRoom, fetchRooms, joinRoom, fetchRoomById } = require("../controllers/room.controller");
const { avatarStore, positionUpdate, reConnectUser } = require('../controllers/user.controller');
const { loadData, users } = require("../database/db");
const { signup, login, logout } = require("./auth.utils");

function initializeSocket(io) {
    io.of('/socket').on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        const sendResponse = (eventName, data, requestId) => {
            socket.emit(`${eventName}_response`, { ...data, requestId });
        };

        socket.on('reconnectUser', async ({ userId, roomId, requestId }) => {
            try {
                loadData()
                socket.join(roomId);
                await reConnectUser(userId, socket.id).then(() => {
                    sendResponse('reconnectUser', {}, requestId);
                })
            } catch (error) {
                console.error('Error in reconnectUser:', error);
                sendResponse('error', { message: error.message }, requestId);
            }
        });

        socket.on('signup', async ({ userData, requestId }) => {
            try {
                if (userData) userData.socketId = socket.id;
                const { newUser, err: signupError } = await signup(userData);
                if (signupError) throw new Error(signupError);
                sendResponse('signup', { signupData: newUser }, requestId);
            } catch (error) {
                console.error('Error in signup:', error);
                sendResponse('error', { message: error.message }, requestId);
            }
        });

        socket.on('login', async ({ userData, requestId }) => {
            try {
                if (userData) userData.socketId = socket.id;
                const { user, error: loginError } = await login(userData);
                if (loginError) throw new Error(loginError);
                sendResponse('login', { loginData: user }, requestId);
            } catch (error) {
                console.error('Error in login:', error);
                sendResponse('error', { message: error }, requestId);
            }
        });

        socket.on('createRoom', async ({ requestId }) => {
            try {
                loadData()
                const roomData = await createRoom();
                sendResponse('createRoom', { roomData }, requestId);
            } catch (error) {
                console.error('Error in createRoom:', error);
                sendResponse('error', { message: error.message }, requestId);
            }
        });

        socket.on('fetchRooms', async ({ requestId }) => {
            try {
                loadData()
                const rooms = await fetchRooms();
                sendResponse('fetchRooms', { rooms }, requestId);
            } catch (error) {
                console.error('Error in fetchRooms:', error);
                sendResponse('error', { message: error.message }, requestId);
            }
        });

        socket.on('fetchRoomById', async ({ roomId, requestId }) => {
            try {
                loadData()
                const room = await fetchRoomById(roomId)
                sendResponse('fetchRoomById', { room }, requestId);
            } catch (error) {
                console.error('Error in fetchRoomById:', error);
                sendResponse('error', { message: error.message }, requestId);
            }
        })

        socket.on('joinRoom', async ({ roomId, userId, requestId }) => {
            try {
                loadData()
                const updatedRoomData = await joinRoom(roomId, userId, socket.id);
                socket.join(roomId);
                sendResponse('joinRoom', { roomId, updatedRoomData }, requestId);
            } catch (error) {
                console.error('Error in joinRoom:', error);
                sendResponse('error', { message: error.message }, requestId);
            }
        });

        socket.on('playerMovement', async ({ movementData, requestId }) => {
            try {
                const { roomId } = movementData;
                await positionUpdate(movementData, socket.id);
                socket.to(roomId).emit('playerMovement', { action: 'playerMovement', data: movementData, requestId });
                sendResponse('playerMovement', {}, requestId);
            } catch (error) {
                console.error('Error in playerMovement:', error);
                sendResponse('error', { message: error.message }, requestId);
            }
        });

        socket.on('avatarStore', async ({ avatarData, requestId }) => {
            try {
                console.log(socket.id)
                const avatarId = await avatarStore(avatarData, socket.id);
                sendResponse('avatarStore', { avatarId }, requestId);
            } catch (error) {
                console.error('Error in avatarStore:', error);
                sendResponse('error', { message: error.message }, requestId);
            }
        });
        socket.on('buyProduct', async ({ productId, buyer, price, quantity, requestId }) => {
            try {
                const product = await buyProduct(socket.id, productId, buyer, price, quantity)
                sendResponse('buyProduct', { product }, requestId);
            }
            catch (error) {
                console.error('Error in buy product:', error);
                sendResponse('error', { message: error.message }, requestId);
            }
        })

        socket.on('disconnect', async () => {
            try {
                await logout(socket.id);
                console.log('Client disconnected:', socket.id);
            } catch (error) {
                console.error('Error during disconnect:', error);
            }
        });
    });
}

module.exports = { initializeSocket };
