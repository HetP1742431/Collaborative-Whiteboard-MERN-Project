import express from "express";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// User sign-up route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Password hashing
    const hashedPassord = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassord });
    await newUser.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// User log-in route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Password comparison
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Create JWT payload
    const tokenData = { user: user.username };

    // Sign access token
    const accessToken = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    // Sign refresh token
    const refreshToken = jwt.sign(tokenData, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json({ accessToken }, { message: `Welcome back ${user.username}` });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Refresh token route
router.post("/token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ error: "No refresh token, authorization denied" });
  }

  // Verify authorization token validity
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const tokenData = { user: decoded.user.username };

    // Sign new access token
    const accessToken = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ error: "Token not valid, authorization denied" });
  }
});

// User logout route
router.post("/logout", authMiddleware, (req, res) => {
  res
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .json({ message: "Logged out successfully" });
});

export default router;
