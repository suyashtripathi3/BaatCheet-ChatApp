import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

// ------------------ SIGNUP ------------------
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // 1️⃣ Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Save new user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // 5️⃣ Generate JWT Token
    generateToken(newUser._id, res);

    // 6️⃣ Send Response (fast)
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic || "",
    });

    // 7️⃣ Send Welcome Email (non-blocking)
    sendWelcomeEmail(newUser.email, newUser.fullName, ENV.CLIENT_URL).catch(
      (err) => console.error("❌ Failed to send welcome email:", err)
    );
  } catch (error) {
    console.error("❌ Error in signup controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ------------------ LOGIN ------------------
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid email or password" });

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic || "",
    });
  } catch (error) {
    console.error("❌ Error in login controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ------------------ LOGOUT ------------------
export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

// ------------------ UPDATE PROFILE ------------------
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic)
      return res.status(400).json({ message: "Profile picture is required" });

    const userId = req.user._id;

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("❌ Error in updateProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
