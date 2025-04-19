import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    userPassword: {
      type: String,
      required: true,
      trim: true,
    },
    userImage: {
      type: String,
      trim: true,
      default:
        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
    },
    userSocket_id: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    lastActive: {
      type: Date,
    },
    lastMessage: [
      {
        message: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Message",
        },
        room: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Room",
        },
      },
    ],
    blocked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
    friendRequests: [
      {
        from: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    allFriends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    archive: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
