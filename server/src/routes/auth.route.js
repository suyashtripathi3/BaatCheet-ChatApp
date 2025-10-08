import express from "express";
import { signup } from "../controllers/auth.controller.js";

const authRoute = express.Router();

authRoute.post("/signup", signup);
authRoute.get("/login", (req, res) => {
  res.send("login route");
});
authRoute.get("/logout", (req, res) => {
  res.send("logout route");
});

export default authRoute;
