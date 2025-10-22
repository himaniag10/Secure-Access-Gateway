import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Audit from "../models/Audit.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    if (req.user) {
      res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    console.log("Register attempt:", { name, email, role });

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Prevent unauthorized admin creation
    if (role === "admin") {
      return res
        .status(403)
        .json({ message: "You cannot register as admin directly" });
    }

    email = email.trim().toLowerCase();
    password = password.trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ DON'T hash manually - let the model do it!
    const user = await User.create({
      name,
      email,
      password: password, // ✅ Pass plain password - pre-save hook will hash it
      role: role || "user",
    });

    console.log("User registered successfully:", user.email);

    // Audit log for registration
    try {
      await Audit.create({
        user: user._id,
        action: "User Registered",
        ip: req.ip || req.connection?.remoteAddress || "unknown",
        success: true,
      });
    } catch (auditError) {
      console.error("Audit error during registration:", auditError);
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", async (req, res) => {
  try {
    console.log("Login attempt received:", {
      email: req.body.email,
      hasPassword: !!req.body.password,
    });

    let email = req.body.email?.trim().toLowerCase();
    let password = req.body.password?.trim();

    if (!email || !password) {
      console.log("Missing credentials");
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    console.log("Looking up user:", email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("User found, comparing passwords");
    
    // ✅ Use the model's matchPassword method
    const isMatch = await user.matchPassword(password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch for:", email);
      
      // Audit failed login
      try {
        await Audit.create({
          user: user._id,
          action: "Failed Login",
          ip: req.ip || req.connection?.remoteAddress || "unknown",
          success: false,
        });
      } catch (auditError) {
        console.error("Audit error during failed login:", auditError);
      }
      
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("Login successful for:", email);

    // Audit successful login
    try {
      await Audit.create({
        user: user._id,
        action: "Login",
        ip: req.ip || req.connection?.remoteAddress || "unknown",
        success: true,
      });
    } catch (auditError) {
      console.error("Audit error during successful login:", auditError);
    }

    const token = generateToken(user);
    console.log("Token generated, sending response");

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (optional - mainly for audit)
// @access  Private
router.post("/logout", protect, async (req, res) => {
  try {
    // Audit logout
    try {
      await Audit.create({
        user: req.user._id,
        action: "Logout",
        ip: req.ip || req.connection?.remoteAddress || "unknown",
        success: true,
      });
    } catch (auditError) {
      console.error("Audit error during logout:", auditError);
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;