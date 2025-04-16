import Room from "../models/room.model.js";

export const roomChat = async (req, res) => {
  try {
    const formUser = req.user;

    const { roomType, roomName } = req.body;

    const room = await Room.findOne({ roomName })
      .populate({
        path: "roomMembers",
        selsect: "userName image isActive lastActive",
      })
      .populate({
        path: "messages",
        select: "-room -receiver",
        populate: {
          path: "sender",
          select: "userName image isActive lastActive",
        },
      });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room is not found",
      });
    }

    return res.status(200).json({
      success: true,
      roomName: room.roomName,
      roomTitle: room.roomTitle,
      roomPhoto: roomroom.roomPhoto,
      allChats: room.messages,
      roomMembers: room.roomMembers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//"roomMembers": [{ "userName": "", "isActive": true, "lastActive": "Date" }]
