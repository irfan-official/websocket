import cors from "cors";
dotenv.config();
import express from "express";
import http from "http";
import apiRoute from "./routes/api.routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import wsConnection from "./config/connection/ws.connection.js";
import dbConnection from "./config/connection/db.connection.js";
const app = express();
const httpServer = http.createServer(app);

export { httpServer };

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with the frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

app.use("/api", apiRoute);
app.get("/", (req, res) => {
  return res.status(201).send("hello");
});

// io.on("connection", (socket) => {
//   console.log("connected to the user", socket.id);

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });

//   socket.on("register", async (obj) => {
//     socket.join("room");
//   });

//   socket.on("message", async (data) => {
//     console.log("Message received:", data);

//     const senderUser = await User.findOne({ email: "contact@irfans.dev" });
//     const receiverUser = await User.findOne({ email: "naira@naira.dev" });

//     // Save message in DB
//     const savedMessage = await Message.create({
//       sender: senderUser._id,
//       reciever: receiverUser._id,
//       message: data.message,
//     });

//     socket.emit("reply", {
//       message: data.message,
//       from: "self",
//     });

//     // Send to all others (excluding sender)
//     socket.broadcast.emit("reply", {
//       message: data.message,
//       from: "other",
//       img: senderUser.img,
//     });
//   });
// });

httpServer.listen(process.env.PORT, () => {
  dbConnection();
  wsConnection(httpServer);
  console.log(`server started at http://localhost:${process.env.PORT}`);
});
