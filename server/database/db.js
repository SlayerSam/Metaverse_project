const fs = require('fs');
const path = require('path');

// Paths to JSON files
const usersFile = path.resolve(__dirname, 'users.json');
const roomsFile = path.resolve(__dirname, 'rooms.json');
const avatarsFile = path.resolve(__dirname, 'avatars.json');

// In-memory objects
let users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
let rooms = JSON.parse(fs.readFileSync(roomsFile, 'utf-8'));
let avatars = JSON.parse(fs.readFileSync(avatarsFile, 'utf-8'));;

// Function to load data from JSON files into in-memory objects
function loadData() {
    if (fs.existsSync(usersFile)) {
        users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    }
    if (fs.existsSync(roomsFile)) {
        rooms = JSON.parse(fs.readFileSync(roomsFile, 'utf-8'));
    }
    if (fs.existsSync(avatarsFile)) {
        avatars = JSON.parse(fs.readFileSync(avatarsFile, 'utf-8'));
    }
}

// Function to save data from in-memory objects to JSON files
function saveData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Proxies to automatically save data when objects are updated
users = new Proxy(users, {
    set(target, key, value) {
        target[key] = value;
        saveData(usersFile, target);
        return true;
    },
    deleteProperty(target, key) {
        delete target[key];
        saveData(usersFile, target);
        return true;
    },
});

rooms = new Proxy(rooms, {
    set(target, key, value) {
        target[key] = value;
        saveData(roomsFile, target);
        return true;
    },
    deleteProperty(target, key) {
        delete target[key];
        saveData(roomsFile, target);
        return true;
    },
    get(target, key) {
        const value = target[key];
        if (typeof value === 'object' && value !== null) {
            return new Proxy(value, {
                set(nestedTarget, nestedKey, nestedValue) {
                    nestedTarget[nestedKey] = nestedValue;
                    saveData(roomsFile, target); 
                    return true;
                }
            });
        }
        return value;
    }
});

avatars = new Proxy(avatars, {
    set(target, key, value) {
        target[key] = value;
        saveData(avatarsFile, target);
        return true;
    },
    deleteProperty(target, key) {
        delete target[key];
        saveData(avatarsFile, target);
        return true;
    },
});

module.exports = { users, rooms, avatars, loadData };
