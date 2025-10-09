import express from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const messageRoute = express.Router();

// the middle ware executed in sequence - so requests get rate limited first, then get authenticated.
// this is actually more efficient as it saves unnecessary authentication checks for requests that are going to be blocked by rate limiting anyway.
messageRoute.use(arcjetProtection, protectRoute);

messageRoute.get("/contacts", getAllContacts);
messageRoute.get("/chats", getChatPartners);
messageRoute.get("/:id", getMessagesByUserId);
messageRoute.post("/send/:id", sendMessage);

export default messageRoute;
