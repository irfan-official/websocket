import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    notificationTypes: {
      type: String,
      enum: ["friendRequest", "updates", "message"],
      required: true,
    },
    message: {
      type: String,
      trim: true,
      required: true,
    },
    issueBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
