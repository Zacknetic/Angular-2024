const express = require('express');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');

const app = express();
const key = fs.readFileSync('./server.key', 'utf8');
const cert = fs.readFileSync('./server.cert', 'utf8');
const server = https.createServer({ key: key, cert: cert }, app);
const wss = new WebSocket.Server({ server });

const rooms = {}; // Format: { roomId: { users: Map(userId, WebSocket), ... } }

wss.on('connection', (ws) => {
    let currentUserRoom = null;
    let userName = null;

    ws.on('message', (message) => {
        const data = JSON.parse(message);
		console.log(data);
        switch (data.type) {
            case 'join':
                userName = data.name; // Unique identifier for the user
                const roomId = data.roomId;
                currentUserRoom = roomId;

                if (!rooms[roomId]) {
                    rooms[roomId] = { users: new Map() };
                }

                rooms[roomId].users.set(userName, ws);
                broadcastToRoom(roomId, userName, { type: 'user-joined', name: userName });
                break;
            case 'leave':
                leaveRoom(userName, currentUserRoom);
                break;
            case 'offer':
            case 'answer':
            case 'candidate':
                // Send message to specific user in the room
                const targetUserWs = rooms[data.roomId]?.users.get(data.target);
                if (targetUserWs) {
                    targetUserWs.send(JSON.stringify(data));
                }
                break;
            // Handle more cases as needed
        }
    });

    ws.on('close', () => {
        leaveRoom(userName, currentUserRoom);
    });
});

function leaveRoom(userName, roomId) {
    if (rooms[roomId] && rooms[roomId].users.has(userName)) {
        rooms[roomId].users.delete(userName);
        broadcastToRoom(roomId, userName, { type: 'user-left', name: userName });

        if (rooms[roomId].users.size === 0) {
            delete rooms[roomId];
        }
    }
}

function broadcastToRoom(roomId, senderName, message) {
    if (rooms[roomId]) {
        rooms[roomId].users.forEach((ws, userName) => {
            if (userName !== senderName) { // Optionally exclude the sender from receiving their own message
                ws.send(JSON.stringify(message));
            }
        });
    }
}

const port = 3000;
server.listen(port, () => {
    console.log(`Server listening on https://192.168.50.12:${port}`);
});
