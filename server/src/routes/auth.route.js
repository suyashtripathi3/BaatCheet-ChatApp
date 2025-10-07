import express from "express";

const authRoute = express.Router();

authRoute.get("/signup", (req, res) => {
  res.send("signup route");
});
authRoute.get("/login", (req, res) => {
  res.send("login route");
});
authRoute.get("/logout", (req, res) => {
  res.send("logout route");
});

export default authRoute;
