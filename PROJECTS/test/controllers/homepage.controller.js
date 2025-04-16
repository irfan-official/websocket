import User from "../models/user.model.js";

// Middleware fetches the JWT token from user, extracts it, and verifies the user._id
// Then it saves the user in req.user

try {
  const fromUser = req.user;

  const userDetails = await User.findOne({ _id: fromUser._id }).populate({
    path: "rooms",
    populate: [
      {
        path: "roomMembers",
        select: "_id userName image isActive lastActive",
      },
      {
        path: "messages",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "sender",
          select: "_id userName image",
        },
      },
    ],
  });

  return res.status(200).json({
    success: true,
    fromUserImage: userDetails?.image,
    rooms: userDetails?.rooms || [],
  });
} catch (error) {
  return res.status(500).json({
    success: false,
    error: "Internal server error",
  });
}
