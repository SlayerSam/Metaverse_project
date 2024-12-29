const { avatars, users, rooms } = require("../database/db");
const { useId } = require("../utils/db.utils");

async function avatarStore(data, socketId) {
    try {
        console.log(socketId, data)
        const avtarId = useId()
        avatars[avtarId] = data;
        users[socketId].avatar = avtarId;
        return avtarId;
    } catch (error) {
        console.error('Error in avatarStore:', error);
        throw error;
    }
}

async function positionUpdate(data, socketId) {
    try {
        const userId = data.userId;
        delete data.roomId;
        avatars[users[socketId].avatar] = {
            ...avatars[users[socketId].avatar],
            ...data
        };
        return true;
    } catch (error) {
    }
}

async function reConnectUser(userId, socketId) {
    try {
        if (!users[socketId]) {
            Object.entries(users).forEach(([key, val], index) => {
                if (val.id === userId) {
                    users[socketId] = val
                    if (!rooms[val.roomId].users.includes(userId))
                        rooms[val.roomId].users = [...rooms[val.roomId].users, userId];
                    avatars[users[socketId].avatar].isMoving = false;
                    avatars[users[socketId].avatar].isJumping = false;
                    delete users[key]
                }
            })
        }
    }
    catch (error) {
        console.error('Error reconnecting user:', error);
        throw error;
    }
}

module.exports = { avatarStore, positionUpdate, reConnectUser }