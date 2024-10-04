const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let clients = {};

wss.on('connection', (ws) => {
    const playerId = `player-${Math.random()}`;
    clients[playerId] = ws;

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        // Broadcast the message to all connected clients
        Object.keys(clients).forEach((id) => {
            if (id !== playerId) {
                clients[id].send(JSON.stringify(data));
            }
        });
    });

    ws.on('close', () => {
        delete clients[playerId];
    });
});
