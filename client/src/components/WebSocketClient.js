import { io } from 'socket.io-client';

export const createRoom = () => {
    return new Promise((resolve, reject) => {
        // Connect to the Socket.IO server
        const socket = io(process.env.NEXT_PUBLIC_WEB_SOCKET_URL); // Ensure this env variable is set


        // Handle connection open
        socket.on('connect', () => {
            // Emit the createRoom event when the connection is established
            socket.emit('message', JSON.stringify({ action: 'createRoom' }));
        });

        // Handle incoming messages
        socket.on('message', (event) => {
            try {
                const data = JSON.parse(event);

                if (data.action === 'roomCreated') {
                    // Resolve the promise with room data when a room is successfully created
                    resolve(data.roomData);
                } else {
                    // Reject the promise if something went wrong
                    reject('Failed to create room');
                }
            } catch (error) {
                // Reject on any JSON parsing errors
                reject(`Failed to parse Socket.IO message: ${error.message}`);
            } finally {
                // Close the socket connection after processing the message
                socket.disconnect();
            }
        });

        // Handle Socket.IO errors
        socket.on('connect_error', (error) => {
            console.error('Socket.IO connection error:', error);
            reject(`Socket.IO connection error: ${error.message}`);
            socket.disconnect(); // Close the connection on error
        });

        // Handle Socket.IO disconnection (optional)
        socket.on('disconnect', () => {
            console.log('Socket.IO connection closed');
        });
    });
};

export const fetchRoom = (setRooms) => {
    return new Promise((resolve, reject) => {
        // Connect to the Socket.IO server
        const socket = io(process.env.NEXT_PUBLIC_WEB_SOCKET_URL); // Ensure this env variable is set


        // Handle connection open
        socket.on('connect', () => {
            // Emit the createRoom event when the connection is established
            socket.emit('message', JSON.stringify({ action: 'fetchRooms' }));
        });

        // Handle incoming messages
        socket.on('message', (event) => {
            try {
                const data = JSON.parse(event);

                if (data.action === 'roomsFetched') {
                    // Resolve the promise with room data when a room is successfully 
                    setRooms(data.rooms);
                    resolve(data.rooms);
                } else {
                    // Reject the promise if something went wrong
                    reject('Failed to create room');
                }
            } catch (error) {
                // Reject on any JSON parsing errors
                reject(`Failed to parse Socket.IO message: ${error.message}`);
            } finally {
                // Close the socket connection after processing the message
                socket.disconnect();
            }
        });

        // Handle Socket.IO errors
        socket.on('connect_error', (error) => {
            console.error('Socket.IO connection error:', error);
            reject(`Socket.IO connection error: ${error.message}`);
            socket.disconnect(); // Close the connection on error
        });

        // Handle Socket.IO disconnection (optional)
        socket.on('disconnect', () => {
            console.log('Socket.IO connection closed');
        });
    });
};

export const joinRoom = (userId, roomId, setIsOpen) => {
    return new Promise((resolve, reject) => {
        // Connect to the Socket.IO server
        const socket = io(process.env.NEXT_PUBLIC_WEB_SOCKET_URL); // Ensure this env variable is set


        // Handle connection open
        socket.on('connect', () => {
            // Emit the createRoom event when the connection is established
            socket.emit('message', JSON.stringify({ action: 'joinRoom', userId: userId, roomId: roomId }));
        });

        // Handle incoming messages
        socket.on('message', (event) => {
            try {
                const data = JSON.parse(event);
                if (data.action === 'roomJoined') {
                    // Resolve the promise with room data when a room is successfully created
                    setIsOpen(false)
                    resolve(data.rooms);
                } else {
                    // Reject the promise if something went wrong
                    reject('Failed to create room');
                }
            } catch (error) {
                // Reject on any JSON parsing errors
                reject(`Failed to parse Socket.IO message: ${error.message}`);
            } finally {
                // Close the socket connection after processing the message
                socket.disconnect();
            }
        });

        // Handle Socket.IO errors
        socket.on('connect_error', (error) => {
            console.error('Socket.IO connection error:', error);
            reject(`Socket.IO connection error: ${error.message}`);
            socket.disconnect(); // Close the connection on error
        });

        // Handle Socket.IO disconnection (optional)
        socket.on('disconnect', () => {
            console.log('Socket.IO connection closed');
        });
    });
};

export const avatarStore = (avatarData) => {
    return new Promise((resolve, reject) => {
        // Connect to the Socket.IO server
        const socket = io(process.env.NEXT_PUBLIC_WEB_SOCKET_URL); // Ensure this env variable is set


        // Handle connection open
        socket.on('connect', () => {
            // Emit the createRoom event when the connection is established
            socket.emit('message', JSON.stringify({ action: 'avatarStore', avatarData: avatarData }));
        });

        // Handle incoming messages
        socket.on('message', (event) => {
            try {
                const data = JSON.parse(event);
                if (data.action === 'avatarStored') {
                    // Resolve the promise with room data when a room is successfully created
                    resolve(data.rooms);
                } else {
                    // Reject the promise if something went wrong
                    reject('Failed to create room');
                }
            } catch (error) {
                // Reject on any JSON parsing errors
                reject(`Failed to parse Socket.IO message: ${error.message}`);
            } finally {
                // Close the socket connection after processing the message
                socket.disconnect();
            }
        });

        // Handle Socket.IO errors
        socket.on('connect_error', (error) => {
            console.error('Socket.IO connection error:', error);
            reject(`Socket.IO connection error: ${error.message}`);
            socket.disconnect(); // Close the connection on error
        });

        // Handle Socket.IO disconnection (optional)
        socket.on('disconnect', () => {
            console.log('Socket.IO connection closed');
        });
    });
};