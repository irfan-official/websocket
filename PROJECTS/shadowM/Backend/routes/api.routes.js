import express from "express";

import {
  handleLogin,
  handleRegister,
  handleJoinRoom,
  handleCreateRoom,
} from "../controllers/api.controller.js";
const route = express.Router();
export default route;

route.post("/login", handleLogin);
route.post("/register", handleRegister);
route.post("/createroom", handleCreateRoom);
route.post("/joinroom", handleJoinRoom);
