import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const authRoute = express.Router();
authRoute.use(arcjetProtection);

// authRoute.get("/test", arcjetProtection, (req, res) => {
//   res.status(200).json({ message: "Test route " });
// });

authRoute.post("/signup", signup);
authRoute.post("/login", login);
authRoute.post("/logout", logout);

authRoute.put("/update-profile", protectRoute, updateProfile);

authRoute.get("/check", protectRoute, (req, res) =>
  res.status(200).json(req.user)
);
export default authRoute;
