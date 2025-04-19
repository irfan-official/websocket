import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomType: {
      type: String,
      enum: ["group", "private"],
      default: "private",
      required: true,
    },
    roomName: {
      type: String,
      required: true,
      unique: true,
    },
    roomTitle: [
      {
        type: String,
        required: true,
      },
    ],
    roomPhoto: [
      {
        userID: {
          type: String,
        },
        image: {
          type: String,
          trim: true,
        },
      },
    ],
    roomMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    unseenMessage: {
      type: String,
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
