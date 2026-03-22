import bcrypt from "bcrypt";
import User from "../models/User.js";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, //  important for production (Render)
      sameSite: "None",
    });

    return res.status(200).json({
      role: user.role,
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, bio } = req.body || {};

    const existingUser = await User.findOne({ email });

    //  If user exists → delete uploaded image safely
    if (existingUser) {
      if (req.imagePath) {
        const imagePath = path.join("./uploads", req.imagePath);

        if (fs.existsSync(imagePath)) {
          try {
            fs.unlinkSync(imagePath);
          } catch (err) {
            console.log("Image delete error:", err.message);
          }
        }
      }

      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      image: req.imagePath || null,
      bio,
    });

    return res.status(201).json({
      message: "Registered successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Registration failed",
      error: err.message,
    });
  }
};

/* ================= GET PROFILE ================= */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to fetch profile",
      error: err.message,
    });
  }
};

/* ================= UPDATE PROFILE ================= */
export const updateUserProfile = async (req, res) => {
  try {
    const { email, username } = req.body || {};

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.email = email || user.email;
    user.username = username || user.username;

    //  Safe image update
    if (req.imagePath) {
      if (user.image) {
        const oldPath = path.join("./uploads", user.image);

        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (err) {
            console.log("Old image delete error:", err.message);
          }
        }
      }

      user.image = req.imagePath;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Update failed",
      error: err.message,
    });
  }
};