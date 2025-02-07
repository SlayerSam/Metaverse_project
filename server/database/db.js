const fs = require('fs');
const path = require('path');

// Paths to JSON files
const usersFile = path.resolve(__dirname, 'users.json');
const roomsFile = path.resolve(__dirname, 'rooms.json');
const avatarsFile = path.resolve(__dirname, 'avatars.json');
const productsBuyedFile = path.resolve(__dirname, 'products_buyed.json');

// Function to ensure a JSON file exists
function ensureFileExists(filePath, defaultData = {}) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
    }
}

// Ensure all files exist
ensureFileExists(usersFile, {});
ensureFileExists(roomsFile, {});
ensureFileExists(avatarsFile, {});
ensureFileExists(productsBuyedFile, []);

// Read JSON files
let users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
let rooms = JSON.parse(fs.readFileSync(roomsFile, 'utf-8'));
let avatars = JSON.parse(fs.readFileSync(avatarsFile, 'utf-8'));
let productsBuyed = JSON.parse(fs.readFileSync(productsBuyedFile, 'utf-8'));

// Function to reload data from files
function loadData() {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    rooms = JSON.parse(fs.readFileSync(roomsFile, 'utf-8'));
    avatars = JSON.parse(fs.readFileSync(avatarsFile, 'utf-8'));
    productsBuyed = JSON.parse(fs.readFileSync(productsBuyedFile, 'utf-8'));
}

// Function to save data to a JSON file
function saveData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Create Proxies for automatic saving
function createAutoSaveProxy(target, filePath) {
    return new Proxy(target, {
        set(obj, prop, value) {
            obj[prop] = value;
            saveData(filePath, obj);
            return true;
        },
        deleteProperty(obj, prop) {
            delete obj[prop];
            saveData(filePath, obj);
            return true;
        },
        get(obj, prop) {
            const value = obj[prop];
            if (typeof value === 'object' && value !== null) {
                return createAutoSaveProxy(value, filePath); // Handle nested objects
            }
            return value;
        }
    });
}

// Wrap objects with proxies
users = createAutoSaveProxy(users, usersFile);
rooms = createAutoSaveProxy(rooms, roomsFile);
avatars = createAutoSaveProxy(avatars, avatarsFile);
productsBuyed = createAutoSaveProxy(productsBuyed, productsBuyedFile);

module.exports = { users, rooms, avatars, productsBuyed, loadData };
