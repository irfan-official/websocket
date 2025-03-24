import express from "express";
import http from "http";
import apiRoute from "./routes/api.routes.js";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import userModel from "./config/models/user.models.js";
import dbConnection from "./config/connection/db.connection.js";
const app = express();
const httpServer = http.createServer(app);
let Req = {};
let prervSocketID = "";
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Replace with the frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with the frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  })
);

httpServer.listen(process.env.PORT, () =>
  console.log(`server started at http://localhost:${process.env.PORT}`)
);
dbConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use("/api", apiRoute);

app.get("/", (req, res) => {
  return res.status(201).send("hello");
});

io.on("connection", (socket) => {
  console.log("connected to the user", socket.id);

  //socket.to("room").on("image",);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("register", async (obj) => {
    socket.join("room");
  });

  socket.on("message", async (data) => {
    console.log("Message received:", data);
    io.to("room").emit("reply", data);
  });
});
