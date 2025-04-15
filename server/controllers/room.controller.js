const { rooms, users, avatars } = require("../database/db");
const { useId } = require("../utils/db.utils");

const MAX_ROOM_CAPACITY = 5;

async function createRoom() {
    try {
        const roomId = useId()
        if (rooms.length > 0) {
            let flag = Object.entries(rooms).every(([key, val]) => val.capacity === 0);
            if (flag) {
                rooms[roomId] = {
                    id: roomId,
                    users: [],
                    capacity: MAX_ROOM_CAPACITY,
                    createdAt: Date.now(),
                    lastEmptyTimestamp: Date.now(),
                }
            }
        }
        else {
            rooms[roomId] = {
                id: roomId,
                users: [],
                capacity: MAX_ROOM_CAPACITY,
                createdAt: Date.now(),
                lastEmptyTimestamp: Date.now(),
            }
        }
    } catch (error) {
        console.error('Error creating room:', error);
        throw error;
    }
}

const getUserById = (id) => {
    let val = null;
    Object.entries(users).forEach(([key, user], index) => {
        if (user.id === id) {
            val = user;
        }
    })
    return val
}

async function fetchRooms() {
    let roomsArr = Object.entries(rooms).map(([key, val]) => {
        return val
    })
    return roomsArr;
}


async function fetchRoomById(roomId) {
    console.log(rooms)
    let roomData = rooms[roomId];
    if (!roomData) {
        throw new Error(`Room with ID ${roomId} not found`);
    }

    let roomWithAvatars = roomData?.users?.map((user) => {
        const userObj = getUserById(user)
        return {
            ...userObj,
            ...avatars[userObj.avatar]
        };
    });

    return {
        ...roomData,
        avatars: roomWithAvatars
    };
}



async function deleteOldEmptyRooms(roomId) {
    try {
        const oneHourAgo = Date.now() - 60 * 60 * 1000; // Current time minus 1 hour
        Object.entries(rooms).forEach(([key, val]) => {
            if (val.capacity === 5 && val.lastEmptyTimestamp <= oneHourAgo && val.id != roomId) {
                delete rooms[key];
            }
        });
    } catch (error) {
        console.error('Error deleting old empty rooms:', error);
        throw error;
    }
}

// Function to join a room
async function joinRoom(roomId, userId, socketId) {
    try {
        await deleteOldEmptyRooms(roomId);
        console.log(roomId)
        users[socketId].roomId = roomId;
        console.log(rooms[roomId].users);
        if (!rooms[roomId].users.includes(userId)) {
            rooms[roomId].users = [...rooms[roomId].users, userId];
            rooms[roomId].capacity -= 1;
        }
    } catch (error) {
        console.error('Error joining room:', error);
        throw error;
    }
}



module.exports = { createRoom, joinRoom, fetchRooms, fetchRoomById };