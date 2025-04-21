import { assignJWT } from "../services/auth.services.js";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Room from "../models/room.model.js";

export const handleLogin = async (req, res) => {
  const { userEmail, userPassword } = req.body;

  try {
    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found 1",
      });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(
      userPassword,
      user.userPassword
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid password 2",
      });
    }

    assignJWT(res, user._id);

    return res.status(200).json({
      success: true,
      data: {
        userID: user._id,
        userName: user.name,
        userImage: user.img,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error 3",
    });
  }
};

export const handleRegister = async (req, res) => {
  const { userName, userEmail, userPassword, userImage } = req.body;

  if (!userName || !userEmail || !userPassword || !userImage) {
    return res.status(400).json({
      success: false,
      error: "All fields are reequired",
    });
  }

  let salt = await bcrypt.genSalt();
  let hashPassword = await bcrypt.hash(userPassword, salt);

  try {
    const user = await User.create({
      userName,
      userEmail,
      userPassword: hashPassword,
      userImage,
    });

    assignJWT(res, user._id);

    return res.status(200).json({
      success: true,
      data: {
        userID: user._id,
        userName: user.userName,
        userImage: user.userImage,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const handleCreateRoom = async (req, res) => {
  try {
    const { userID, roomType, roomName, roomTitle, roomPhoto } = req.body;

    // Validate fields
    if (!userID || !roomType || !roomName || !roomPhoto) {
      return res
        .status(400)
        .json({ success: false, error: "Please fill all required fields" });
    }

    if (roomType !== "group" && roomType !== "private") {
      return res.status(400).json({
        success: false,
        error: "Room type must be 'group' or 'private'",
      });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    let existingRoom = await Room.findOne({ roomName });

    let room;

    if (!existingRoom) {
      // Create new room
      room = await Room.create({
        roomType,
        roomName,
        roomTitle: roomType === "group" ? [roomTitle] : [],
        roomPhoto: [{ userID, image: roomPhoto }],
        roomMembers: [userID],
      });

      // Add room to user's list
      user.rooms.push(room._id);
      await user.save();
    } else {
      // Room already exists - check if user is in it
      if (!existingRoom.roomMembers.includes(userID)) {
        existingRoom.roomMembers.push(userID);
        await existingRoom.save();

        user.rooms.push(existingRoom._id);
        await user.save();
      }

      room = existingRoom;
    }

    res.status(200).json({
      success: true,
      message: "Room joined successfully",
      room,
    });
  } catch (error) {
    console.error("Join room error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const handleJoinRoom = async (req, res) => {
  try {
    const { userID, roomName } = req.body;

    // Validate fields
    if (!userID || !roomName) {
      return res
        .status(400)
        .json({ success: false, error: "Please fill all required fields" });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    let existingRoom = await Room.findOne({ roomName });

    let room;

    if (!existingRoom) {
      // Create new room
      return res
        .status(500)
        .json({ success: false, error: "No room found, please create a room" });
    } else {
      // Room already exists - check if user is in it
      if (!existingRoom.roomMembers.includes(userID)) {
        existingRoom.roomMembers.push(userID);
        await existingRoom.save();

        user.rooms.push(existingRoom._id);
        await user.save();
      }

      room = existingRoom;
    }

    res.status(200).json({
      success: true,
      message: "Room joined successfully",
      room,
    });
  } catch (error) {
    console.error("Join room error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
