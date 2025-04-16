const { Server } = require("socket.io");
import {
  handleAdminSocket,
  handleNotificationSocket,
} from "./ws.controller.js";

const stablishSocketConnection = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:51733", // React frontend
      methods: ["GET", "POST"],
    },
  });

  io.of("/admin").on("connection", handleAdminSocket);
  io.of("/notifications").on("connection", handleNotificationSocket);
};

module.exports = { stablishSocketConnection };


