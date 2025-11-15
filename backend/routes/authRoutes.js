import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Audit from "../models/Audit.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin passkey - store this in .env file in production
const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || "00000";

// 🔹 Helper function to record audit logs safely
const createAuditLog = async (userId, action, ip, success = true) => {
  try {
    await Audit.create({
      user: userId,
      action,
      ip: ip || "unknown",
      success,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
};

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
      await createAuditLog(req.user._id, "Fetched User Profile (/me)", req.ip, true);
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
    let { name, email, password, role, adminPasskey } = req.body;

    console.log("Register attempt:", { name, email, role });

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // ✅ Check if trying to register as admin
    if (role === "admin") {
      if (!adminPasskey) {
        return res
          .status(403)
          .json({ message: "Admin passkey is required to register as admin" });
      }
      if (adminPasskey !== ADMIN_PASSKEY) {
        return res.status(403).json({ message: "Invalid admin passkey" });
      }
    }

    email = email.trim().toLowerCase();
    password = password.trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password: password,
      role: role || "user",
    });

    console.log("✅ User registered successfully:", user.email, "Role:", user.role);

    // Audit log for registration
    await createAuditLog(
      user._id,
      user.role === "admin" ? "Admin Registered" : "User Registered",
      req.ip,
      true
    );

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
    let adminPasskey = req.body.adminPasskey;

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

    // ✅ Check if user is admin and validate passkey
    if (user.role === "admin") {
      if (!adminPasskey) {
        return res
          .status(403)
          .json({ message: "Admin passkey is required for admin login" });
      }
      if (adminPasskey !== ADMIN_PASSKEY) {
        await createAuditLog(user._id, "Failed Admin Login - Invalid Passkey", req.ip, false);
        return res.status(403).json({ message: "Invalid admin passkey" });
      }
    }

    console.log("User found, comparing passwords");

    // ✅ Use the model's matchPassword method
    const isMatch = await user.matchPassword(password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      await createAuditLog(user._id, "Failed Login - Wrong Password", req.ip, false);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("✅ Login successful for:", email);

    // Audit successful login
    await createAuditLog(
      user._id,
      user.role === "admin" ? "Admin Login" : "User Login",
      req.ip,
      true
    );

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
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (optional - mainly for audit)
// @access  Private
router.post("/logout", protect, async (req, res) => {
  try {
    await createAuditLog(req.user._id, "Logout", req.ip, true);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/auth/activity
// @desc    Log any custom user activity (for frontend tracking)
// @access  Private
router.post("/activity", protect, async (req, res) => {
  try {
    const { action, success } = req.body;

    if (!action) {
      return res.status(400).json({ message: "Action is required" });
    }

    await createAuditLog(req.user._id, action, req.ip, success);
    res.status(201).json({ message: "Activity logged successfully" });
  } catch (error) {
    console.error("Error logging user activity:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
