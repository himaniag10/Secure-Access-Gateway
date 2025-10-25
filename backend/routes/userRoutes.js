import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const users = await User.find().select("_id name email role").sort({ name: 1 });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
