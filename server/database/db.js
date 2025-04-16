const fs = require('fs');
const path = require('path');

// Paths to JSON files
const usersFile = path.resolve(__dirname, 'users.json');
const roomsFile = path.resolve(__dirname, 'rooms.json');
const avatarsFile = path.resolve(__dirname, 'avatars.json');
const productsBuyedFile = path.resolve(__dirname, 'products_buyed.json');
const messagesFile = path.resolve(__dirname, 'messages.json')

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
ensureFileExists(messagesFile, {});
ensureFileExists(productsBuyedFile, []);

// Read JSON files
let users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
let rooms = JSON.parse(fs.readFileSync(roomsFile, 'utf-8'));
let avatars = JSON.parse(fs.readFileSync(avatarsFile, 'utf-8'));
let messages = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));
let productsBuyed = JSON.parse(fs.readFileSync(productsBuyedFile, 'utf-8'));

// Function to reload data from files
function loadData() {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    rooms = JSON.parse(fs.readFileSync(roomsFile, 'utf-8'));
    avatars = JSON.parse(fs.readFileSync(avatarsFile, 'utf-8'));
    messages = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));
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
            // If the value is an object, wrap it in a proxy first
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                value = createAutoSaveProxy(value, filePath);
            }
            obj[prop] = value;
            saveData(filePath, target); // Save the entire root object
            return true;
        },
        deleteProperty(obj, prop) {
            delete obj[prop];
            saveData(filePath, target); // Save the entire root object
            return true;
        },
        get(obj, prop) {
            const value = obj[prop];
            // Only wrap plain objects, not arrays or null
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                return createAutoSaveProxy(value, filePath);
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
messages = createAutoSaveProxy(messages, messagesFile)

module.exports = { users, rooms, avatars, productsBuyed, loadData, messages };
