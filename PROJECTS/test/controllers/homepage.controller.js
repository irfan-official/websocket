
import Room from "../models/room.model.js";

export const getHomepage = async (req, res) => {
  try {
    const fromUser = req.user;

    // Get all rooms that include this user
    const rooms = await Room.find({ roomMembers: fromUser._id })
      .populate({
        path: "roomMembers",
        select: "userName image isActive lastActive",
      })
      .populate({
        path: "messages",
        populate: [
          {
            path: "sender",
            model: "User",
            select: "userName image",
          },
          {
            path: "receiver",
            model: "User",
            select: "userName image",
          },
        ],
      });

    const formattedRooms = rooms.map((room) => {
      return {
        roomType: room.roomType,
        roomName: room.roomName,
        roomTitle: room.roomTitle,
        roomPhoto:
          room.roomType === "group"
            ? (room.roomPhoto || []).map((p) => ({
                image: p.image,
              }))
            : (room.roomPhoto || []).map((p) => ({
                userID: p.userID,
                image: p.image,
              })),

        roomMembers: room.roomMembers.map((member) => ({
          _id: member._id,
          userName: member.userName,
          image: member.image,
          isActive: member.isActive,
          lastActive: member.lastActive,
        })),
        messages: room.messages.map((msg) => ({
          _id: msg._id,
          message: msg.message,
          sender: msg.sender
            ? {
                _id: msg.sender._id,
                userName: msg.sender.userName,
                image: msg.sender.image,
              }
            : null,
          receiver: msg.receiver
            ? {
                _id: msg.receiver._id,
                userName: msg.receiver.userName,
                image: msg.receiver.image,
              }
            : null,
        })),
        lastMessage: room.lastMessage || null,
      };
    });

    res.status(200).json({
      success: true,
      fromUserImage: fromUser.image,
      rooms: formattedRooms,
    });
  } catch (error) {
    console.error("Error in getHomepage:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// response like

/*
{
  "success": true,
  "fromUserImage": "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
  "rooms": [
    {
      "roomType": "private",
      "roomName": "alice_bob_chat",
      "roomTitle": ["Alice", "Bob"],
      "roomPhoto": [
        {
          "userID": "6610fae01b9a2436e4e9b7c2",
          "image": "https://example.com/alice.jpg"
        },
        {
          "userID": "6610fae01b9a2436e4e9b7d3",
          "image": "https://example.com/bob.jpg"
        }
      ],
      "roomMembers": [
        {
          "_id": "6610fae01b9a2436e4e9b7c2",
          "userName": "Alice",
          "image": "https://example.com/alice.jpg",
          "isActive": true,
          "lastActive": "2025-04-14T12:23:45.000Z"
        },
        {
          "_id": "6610fae01b9a2436e4e9b7d3",
          "userName": "Bob",
          "image": "https://example.com/bob.jpg",
          "isActive": false,
          "lastActive": "2025-04-13T18:50:10.000Z"
        }
      ],
      "messages": [
        {
          "_id": "6626e0f5fcb3a44d9b5f6e4b",
          "message": "Hey Bob!",
          "sender": {
            "_id": "6610fae01b9a2436e4e9b7c2",
            "userName": "Alice",
            "image": "https://example.com/alice.jpg"
          },
          "receiver": {
            "_id": "6610fae01b9a2436e4e9b7d3",
            "userName": "Bob",
            "image": "https://example.com/bob.jpg"
          }
        },
        {
          "_id": "6626e0f5fcb3a44d9b5f6e4c",
          "message": "Hey Alice!",
          "sender": {
            "_id": "6610fae01b9a2436e4e9b7d3",
            "userName": "Bob",
            "image": "https://example.com/bob.jpg"
          },
          "receiver": {
            "_id": "6610fae01b9a2436e4e9b7c2",
            "userName": "Alice",
            "image": "https://example.com/alice.jpg"
          }
        }
      ],
      "lastMessage": "Hey Alice!"
    },
    {
      "roomType": "group",
      "roomName": "cs_team",
      "roomTitle": ["CS Squad"],
      "roomPhoto": [
        {
          "image": "https://example.com/cs_team_photo.jpg"
        }
      ],
      "roomMembers": [
        {
          "_id": "6610fae01b9a2436e4e9b7c2",
          "userName": "Alice",
          "image": "https://example.com/alice.jpg",
          "isActive": true,
          "lastActive": "2025-04-14T12:23:45.000Z"
        },
        {
          "_id": "6610fae01b9a2436e4e9b7f9",
          "userName": "Charlie",
          "image": "https://example.com/charlie.jpg",
          "isActive": false,
          "lastActive": "2025-04-10T17:10:00.000Z"
        }
      ],
      "messages": [
        {
          "_id": "6626e0f5fcb3a44d9b5f6e4f",
          "message": "Welcome to the team!",
          "sender": {
            "_id": "6610fae01b9a2436e4e9b7c2",
            "userName": "Alice",
            "image": "https://example.com/alice.jpg"
          },
          "receiver": null
        }
      ],
      "lastMessage": "Welcome to the team!"
    }
  ]
}

*/
