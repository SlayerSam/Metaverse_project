const { users, rooms } = require("../database/db");
const { useId } = require("./db.utils");
const { reConnectUser } = require("../controllers/user.controller");
const signup = async ({ email, password, name, socketId }) => {
    try {
        users[socketId] = {
            id: useId(),
            displayName: name,
            email: email,
            password: password,
            avatar: null,
            roomId: null,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        }
        return { newUser: users[socketId], err: '' }
    }
    catch (e) {
        console.log(e)
        return { newUser: {}, err: e }
    }
}

const getUserByEmail = (email) => {
    let val = null;
    Object.entries(users).forEach(([key, user], index) => {
        if (user.email === email) {
            val = user
        }
    })
    return val
}

const login = async ({ email, password, socketId }) => {
    try {
        const user = getUserByEmail(email)
        if (user) {
            if (email == user.email && password == user.password) {
                await reConnectUser(user.id, socketId);
                users[socketId].lastLogin = new Date().toISOString();
                return { user: users[socketId], error: '' };
            }
            else {
                return { user: {}, error: 'Invalid Login Credentials' }
            }
        }
        else {
            return { user: {}, error: 'User not found' };
        }
    } catch (e) {
        console.log(e);
        return { user: {}, error: e }
    }

}


const logout = async (socketId) => {
    const filteredUsers = rooms[users[socketId].roomId].users.filter(user => user.id != users[socketId].id);
    console.log(filteredUsers)
    rooms[users[socketId].roomId].users = filteredUsers;
};


module.exports = { signup, login, logout };