
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

  io.on("connection", handleSocket);
 
};

module.exports = { stablishSocketConnection };

