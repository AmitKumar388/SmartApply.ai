import { Router } from "express";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import auth from "../middleware/auth.js";

const router = Router();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const user = await User.create({ email, password, fullName: fullName || "" });

    // Create profile automatically
    await Profile.create({
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Failed to create account" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to sign in" });
  }
});

// GET /api/auth/me
router.get("/me", auth, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
