import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET)
    throw new Error("JWT_SECRET is not configured in environment variables");
  const token = jwt.sign({ userId }, ENV.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // preveny XSS attacks : cross site scripting
    // for production
    sameSite: "none",
    // for development
    // sameSite: "strict",
    secure: ENV.NODE_ENV === "development" ? false : true, // Use secure cookies in production
  });

  return token;
};
