import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const authRoute = express.Router();

authRoute.post("/signup", signup);
authRoute.post("/login", login);
authRoute.post("/logout", logout);

authRoute.put("/update-profile", protectRoute, updateProfile);

authRoute.get("/check", protectRoute, (req, res) =>
  res.status(200).json(req.user)
);
export default authRoute;
