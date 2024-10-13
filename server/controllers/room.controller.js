const admin = require('firebase-admin');
const { db } = require('../utils/firebaseAdmin');

const MAX_ROOM_CAPACITY = 5; // Set the maximum capacity for each room
const ONE_HOUR_MS = 60 * 60 * 1000; // 1 hour in milliseconds

// Function to create a room
async function createRoom() {
    const roomsRef = db.collection('rooms');
    const snapshot = await roomsRef.get();

    let roomId;
    let roomData;

    if (snapshot.empty) {
        // Create the first room
        roomId = 'room1';
        roomData = { id: roomId, users: [], capacity: MAX_ROOM_CAPACITY, lastEmptyTimestamp: null };
        await roomsRef.doc(roomId).set(roomData);
    } else {
        // Check for available rooms
        let foundRoom = null;
        snapshot.forEach((doc) => {
            const room = doc.data();
            if (room.users.length < room.capacity) {
                foundRoom = room;
            }
        });

        if (foundRoom) {
            roomId = foundRoom.id;
            roomData = foundRoom;
        } else {
            // All rooms are full, create a new room
            roomId = `room${snapshot.size + 1}`;
            roomData = { id: roomId, users: [], capacity: MAX_ROOM_CAPACITY, lastEmptyTimestamp: null };
            await roomsRef.doc(roomId).set(roomData);
        }
    }

    return roomData;
}

// Function to fetch all rooms
async function fetchRooms() {
    const roomsRef = db.collection('rooms');
    const snapshot = await roomsRef.get();
    return snapshot.docs.map(doc => doc.data());
}

// Function to delete empty rooms older than 1 hour
async function deleteOldEmptyRooms() {
    const roomsRef = db.collection('rooms');
    const snapshot = await roomsRef.get();

    const now = Date.now();
    snapshot.forEach(async (doc) => {
        const room = doc.data();
        if (room.users.length === 0 && room.lastEmptyTimestamp) {
            const timeSinceEmpty = now - room.lastEmptyTimestamp.toMillis();
            if (timeSinceEmpty > ONE_HOUR_MS) {
                await roomsRef.doc(room.id).delete();
            }
        }
    });
}

// Function to join a room
async function joinRoom(roomId, userId) {
    await deleteOldEmptyRooms(); // Clean up old empty rooms

    const roomRef = db.collection('rooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (roomDoc.exists) {
        const roomData = roomDoc.data();
        if (roomData.users.length < roomData.capacity) {
            await roomRef.update({
                users: admin.firestore.FieldValue.arrayUnion(userId),
                lastEmptyTimestamp: null, // Reset since room is no longer empty
            });
            return roomData;
        } else {
            throw new Error('Room is full');
        }
    } else {
        throw new Error('Room does not exist');
    }
}



module.exports = { createRoom, joinRoom, fetchRooms }