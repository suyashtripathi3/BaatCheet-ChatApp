import express from "express";

const messageRoute = express.Router();

messageRoute.get("/send", (req, res) => {
  res.send("send message route");
});

export default messageRoute;