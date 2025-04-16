// ws.controller.js

import Message from "../models/Message.js";
import User from "../models/User.js";
import Room from "../models/Room.js";

export const handleSocket = (socket, io) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("message", async (data) => {
    try {
      const { email, roomName, message } = data;

      const user = await User.findOne({ email });
      if (!user) return socket.emit("reply", { error: "Sender not found" });

      const room = await Room.findOne({ roomName });
      if (!room) return socket.emit("reply", { error: "Room not found" });

      const newMessage = await Message.create({
        room: room._id,
        sender: user._id,
        receiver:
          room.roomType === "group"
            ? undefined
            : room.roomMembers.find((id) => !id.equals(user._id)), // find the actual receiver
        message,
      });

      // Push message ref to Room
      room.messages.push(newMessage._id);
      room.lastMessage = message;
      await room.save();

      // Also push lastMessage to user
      user.lastMessage.push({
        message: newMessage._id,
        room: room._id,
      });
      await user.save();

      // Join the sender to the room (if not already)
      socket.join(room._id.toString());

      // Emit to all users in the room (except sender)
      socket.to(room._id.toString()).emit("message:receive", {
        roomId: room._id,
        message: newMessage,
      });

      // Also send back to sender
      socket.emit("reply", {
        success: true,
        message: newMessage,
      });
    } catch (err) {
      console.error("Socket message error:", err);
      socket.emit("reply", { error: "Internal server error" });
    }
  });

  socket.on("friendReqest", async (data) => {

    
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
};
