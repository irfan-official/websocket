const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:51733", // React frontend
    methods: ["GET", "POST"]
  }
});

// Serve regular routes (like homepage)
app.get("/", (req, res) => {
  res.send("Dashboard Page");
});

// Namespace WebSocket connections to "/ws_connect"
const wsNamespace = io.of("/ws_connect");

wsNamespace.on("connection", (socket) => {
  console.log("A user connected to /ws_connect");

  // Handle messages sent from the frontend
  socket.on("sendMessage", (msg) => {
    console.log("Received message:", msg);
    wsNamespace.emit("receiveMessage", msg); // Broadcast to all connected clients
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected from /ws_connect");
  });
});

// Start the server
server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
