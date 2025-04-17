import { assignJWT } from "../services/auth.services.js";
import bcrypt from "bcrypt";
import User from "../config/models/user.models.js";

export const handleLogin = async (req, res) => {
  const { userEmail, userPassword } = req.body;

  try {
    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found 1",
      });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(
      userPassword,
      user.userPassword
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid password 2",
      });
    }

    assignJWT(res, user._id);

    return res.status(200).json({
      success: true,
      data: {
        userID: user._id,
        userName: user.name,
        userImage: user.img,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error 3",
    });
  }
};

export const handleRegister = async (req, res) => {
  const { userName, userEmail, userPassword, userImage } = req.body;

  let salt = await bcrypt.genSalt();
  let hashPassword = await bcrypt.hash(userPassword, salt);

  try {
    const user = await User.create({
      userName,
      userEmail,
      userPassword: hashPassword,
      userImage,
    });

    assignJWT(res, user._id);

    return res.status(200).json({
      success: true,
      data: {
        userID: user._id,
        userName: user.userName,
        userImage: user.userImage,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
