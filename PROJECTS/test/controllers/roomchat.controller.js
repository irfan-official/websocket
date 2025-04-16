import Room from "../models/room.model.js";
import Message from "../model/message.model.js";

export const roomChat = async (req, res) => {
  try {
    const formUser = req.user;

    const { roomType, roomName } = req.body;

    const room = await Room.findOne({ roomName })
      .populate({
        path: "messages",
        select: "-room -receiver",
        populate: {
          path: "sender",
          select: "userName image",
        },
      })
      .populate({
        path: "roomMembers",
        select: "-blocked -rooms -friends -archive -lastMessage -password",
      });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room is not found",
      });
    }

    return res.status(200).json({
      success: true,
      chatData: room.messages,
      roomData: room,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
