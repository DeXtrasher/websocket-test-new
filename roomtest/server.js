const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Enable CORS for all requests
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (change this to your specific domain for security)
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("A client connected:", socket.id);

    socket.on("create-room", () => {
        const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
        socket.join(roomCode);
        console.log(`Room created: ${roomCode} by ${socket.id}`);
        socket.emit("room-created", roomCode);
    });

    socket.on("join-room", (roomCode) => {
        const rooms = io.sockets.adapter.rooms;
        if (rooms.has(roomCode)) {
            socket.join(roomCode);
            console.log(`${socket.id} joined room: ${roomCode}`);
            socket.emit("room-joined", roomCode);
            io.to(roomCode).emit("message", `A new user joined room ${roomCode}`);
        } else {
            console.log(`Invalid room: ${roomCode}`);
            socket.emit("invalid-room");
        }
    });

    socket.on("disconnect", () => {
        console.log("A client disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
