import jwt from "jsonwebtoken";

export const assignJWT = (res, userID) => {
  const token = jwt.sign(
    {
      userID,
    },
    process.env.JWT_SECRET_KEY
  );
  res.cookie("jwtToken", token);
};


