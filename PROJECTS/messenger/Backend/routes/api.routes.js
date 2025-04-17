import express from "express";
import userModel from "../config/models/user.models.js";
import {
  handleLogin,
  handleRegister,
  handleGetUserData,
} from "../controllers/api.controller.js";
const route = express.Router();
export default route;

route.post("/login", handleLogin);

route.post("/register", handleRegister);

route.get("/getUserData", handleGetUserData);
