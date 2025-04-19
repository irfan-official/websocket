import Message from "../models/messege.model.js";
import User from "../models/user.model.js";
import Room from "../models/room.model.js";

const handleSocket = (socket, io) => {
  console.log(`connected ${socket.id}`);

  socket.on("register", async (data) => {
    try {
      const response = await User.findOne({ _id: data.userID })
        .populate({
          path: "rooms",
          select:
            "roomType roomName roomTitle roomPhoto messages unseenMessage",
          populate: {
            path: "messages",
            select: "room sender receiver message createdAt updatedAt",
            populate: {
              path: "sender",
              select: "_id userName userImage",
            },
          },
        })
        .select("_id userName userImage rooms");

      socket.emit("allData", response);
    } catch (err) {
      console.error("Error during register:", err);
      socket.emit("error", { message: "Failed to register room." });
    }
  });

  socket.on("message", async (data) => {
    // get the roomName, sender_id form the data

    const { senderID, roomName, message } = data;

    // fetch the user form User model

    const senderUser = await User.findOne({ _id: senderID }).select(
      "_id userName userImage"
    );
    // save the message in Message mmodel

    const room = await Room.findOne({ roomName: roomName });

    if (!senderUser || !room) {
      return socket.emit("error", { message: "user or room not found" });
    }

    const saveMessage = await Message.create({
      room: room._id,
      sender: senderUser._id,
      message: message,
      receiver: roomName,
    });

    await Room.findOneAndUpdate(
      { roomName: data.roomName },
      { $push: { messages: saveMessage._id } },
      { upsert: true, new: true }
    );

    // reply with data

    const replyData = {
      sender: {
        _id: senderUser._id,
        userName: senderUser.userName,
        userImage: senderUser.userImage,
      },
      message: saveMessage.message,
    };

    io.to(data.roomName).emit("reply", replyData);
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected ${socket.id}`);
  });

  socket.on("roomEnter", async (data) => {
    try {
      const { userID, roomName } = data;

      const user = await User.findOne({ _id: userID });

      if (!user) {
        const responseError = { message: "user not found" };
        socket.emit("error", responseError);
      }

      const room = await Room.findOne({ roomName: roomName })
        .populate({
          path: "messages",
          select: "_id room sender receiver message createdAt updatedAt",
          populate: {
            path: "sender",
            select: "_id userName userImage",
          },
        })
        .select("messages");

      if (!room) {
        const responseError = { message: "room not found" };
        socket.emit("error", responseError);
      }

      socket.join(roomName);

      const replyData = {
        roomAllMessages: room.messages,
      };

      socket.emit("initialReply", replyData);
    } catch (error) {
      const responseError = { message: error.message };
      socket.emit("error", responseError);
    }
  });
};

export default handleSocket;
