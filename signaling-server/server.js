const express = require('express');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const app = express();

const key = fs.readFileSync('./server.key', 'utf8');
const cert = fs.readFileSync('./server.cert', 'utf8');

const server = https.createServer({ key: key, cert: cert }, app);
const wss = new WebSocket.Server({ server });

const rooms = {}; // Object to manage rooms and their members

// Inside your WebSocket server setup (server.js)
wss.on('connection', function connection(ws) {
	let roomId;
  
	ws.on('message', function incoming(message) {
	  const data = JSON.parse(message);
	  if (data.type === 'join') {
		roomId = data.roomId;
		if (!rooms[roomId]) {
		  rooms[roomId] = new Set();
		}
		rooms[roomId].add(ws);
	  } else {
		rooms[roomId].forEach(client => {
		  if (client !== ws && client.readyState === WebSocket.OPEN) {
			client.send(message);
		  }
		});
	  }
	  // Handle other message types (offer, answer, candidate, chat)...
	});
  
	ws.on('close', function() {
	  if (rooms[roomId]) {
		rooms[roomId].delete(ws);
		if (rooms[roomId].size === 0) {
		  delete rooms[roomId];
		}
	  }
	});
  });
  

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on https://192.168.50.12:${port}`);
});
