import Message from "../config/models/message.models.js";
import User from "../config/models/user.models.js";
import Room from "../config/models/room.models.js";

const handleSocket = (socket, io) => {
  console.log(`connected ${socket.id}`);

  socket.on("register", async (data) => {
    try {
      socket.join(data.roomName);
      const response = await Room.findOne({ roomName: data.roomName })
        .populate({
          path: "allMessages",
          select: "-receiver -_id",
          populate: {
            path: "sender",
            select: "_id userName userImage",
          },
        })
        .select("allMessages");

      socket.emit("allMessages", response?.allMessages || []);
    } catch (err) {
      console.error("Error during register:", err);
      socket.emit("error", { message: "Failed to register room." });
    }
  });

  socket.on("message", async (data) => {
    // get the roomName, sender_id form the data

    const { senderID, message } = data;

    // fetch the user form User model

    const senderUser = await User.findOne({ _id: senderID }).select(
      "_id userName userImage"
    );
    // save the message in Message mmodel

    const saveMessage = await Message.create({
      sender: senderUser._id,
      message: message,
    });

    await Room.findOneAndUpdate(
      { roomName: data.roomName },
      { $push: { allMessages: saveMessage._id } },
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
};

export default handleSocket;

/*{  // responses
  _id: "ROOM_OBJECT_ID",
  allMessages: [
    {
      message: "Hello there!",
      sender: {
        _id: "USER_OBJECT_ID_1",
        userName: "JohnDoe",
        userImage: "https://...user-avatar.png"
      },
      createdAt: "2025-04-17T12:00:00.000Z",
      updatedAt: "2025-04-17T12:01:00.000Z"
    },
    {
      .......
    }
  ]
}
 */
