import express from "express";
import Resource from "../models/Resource.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/resources
// @desc    Get resources - Admin sees all, users see only their access
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    // If admin, return all resources
    if (req.user.role === "admin") {
      const resources = await Resource.find().select("name description url");
      return res.json(resources);
    }

    // For regular users, only show resources they have access to
    const resources = await Resource.find({
      usersWithAccess: req.user._id,
    }).select("name description url");

    res.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;