import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // check if email is valid:regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // 12345 => dbcdchddbhd82u8e839
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      // generateToken(newUser._id, res);
      // await newUser.save();

      //  Presist user first, then issue auth cookie
      const savedUser = await newUser.save();
      generateToken(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });

      //   Tdodo: send welcome email to user
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
    // } catch (error) {
    //   console.log("Error in signup controller:", error);
    //   res.status(500).json({ message: "Internal server error" });
    // }
  } catch (error) {
    console.log("Error in signup controller:", error);
    // Handle - race consition: unique email consraint violation
    if (
      error?.code === 11000 &&
      (error?.keyPattern?.email || err.keyValue?.email)
    ) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
