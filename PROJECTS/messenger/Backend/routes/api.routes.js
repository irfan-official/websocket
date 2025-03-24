import bcrypt from "bcrypt";
import express from "express";
import userModel from "../config/models/user.models.js";
const route = express.Router();
export default route;

route.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    }
    return res.status(200).json({
      img: user.img,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).send("Internal server error");
  }
});

route.post("/register", async (req, res) => {
  console.log("route /api/register ========");
  const { email, number, name, message_id, password, img } = req.body;

  let salt = await bcrypt.genSalt();
  let hash = await bcrypt.hash(password, salt);

  console.log("route /api/register  data = ", req.body);
  try {
    const user = await userModel.create({
      name,
      email,
      number,
      message_id,
      password: hash,
      img,
    });
    return res.status(200).send(user);
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).send("Internal server error");
  }
});
