const { Server } = require("socket.io");

const stablishSocketConnection = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:51733", // React frontend
      methods: ["GET", "POST"],
    },
  });

  // Create a namespace for WebSocket connections
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
};

module.exports = { stablishSocketConnection };


io.of("/admin").on("connection", handleAdminNamespace)
io.of("/notifications").on("connection", handleNotificationsNamespace)
