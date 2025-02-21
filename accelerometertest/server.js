//Code for the server that is running on Glitch. 

const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("Client connected");
    
    ws.on("message", (message) => {
        console.log("Received:", message);
        const msgString = message.toString();
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(msgString);
            }
        });
    });

    ws.on("close", () => console.log("Client disconnected"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`WebSocket Server running on port ${PORT}`));
