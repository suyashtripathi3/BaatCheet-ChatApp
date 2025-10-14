import multer from "multer";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

// ================= Multer Setup =================
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// ================= Helper =================
const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "chat_images" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url); // ✅ return the Cloudinary URL
      }
    );
    stream.end(buffer);
  });
};

// ================= Controllers =================

// Get all contacts (except logged-in user)
export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get messages with a specific user
export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessagesByUserId:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Send message (text + optional image)
export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const file = req.file; // multer parsed file
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !file) {
      return res.status(400).json({ message: "Text or image is required" });
    }

    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "You cannot send message to yourself" });
    }

    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    let imageUrl;
    if (file) {
      imageUrl = await uploadBufferToCloudinary(file.buffer);
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Emit real-time message via socket.io if receiver is online
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a message
export const updateMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { text } = req.body;
    const file = req.file;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (message.senderId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only edit your messages" });
    }

    if (text) message.text = text;
    if (file) {
      const imageUrl = await uploadBufferToCloudinary(file.buffer);
      message.image = imageUrl;
    }

    await message.save();
    res.status(200).json(message);
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get chat partners
export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select("-password");
    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getChatPartners:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
