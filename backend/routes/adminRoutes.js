import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Audit from "../models/Audit.js";
import User from "../models/User.js";
import Resource from "../models/Resource.js"; // create this model for resources

const router = express.Router();

// Middleware to allow only admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

// @route   GET /api/admin/audit-logs
// @desc    Get all audit logs
// @access  Private/Admin
router.get("/audit-logs", protect, adminOnly, async (req, res) => {
  try {
    const logs = await Audit.find().populate("user", "name email role").sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/admin/grant-access
// @desc    Grant a user access to a resource
// @access  Private/Admin
router.post("/grant-access", protect, adminOnly, async (req, res) => {
  const { userId, resourceId } = req.body;
  try {
    const user = await User.findById(userId);
    const resource = await Resource.findById(resourceId);

    if (!user || !resource) {
      return res.status(404).json({ message: "User or Resource not found" });
    }

    resource.allowedUsers.push(user._id);
    await resource.save();

    // Log the admin action
    await Audit.create({
      user: req.user._id,
      action: `Granted access to ${resource.name} for ${user.name}`,
      ip: req.ip,
    });

    res.json({ message: `Access granted to ${user.name} for ${resource.name}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/admin/revoke-access
// @desc    Revoke a user's access to a resource
// @access  Private/Admin
router.post("/revoke-access", protect, adminOnly, async (req, res) => {
  const { userId, resourceId } = req.body;
  try {
    const user = await User.findById(userId);
    const resource = await Resource.findById(resourceId);

    if (!user || !resource) {
      return res.status(404).json({ message: "User or Resource not found" });
    }

    resource.allowedUsers = resource.allowedUsers.filter(
      (id) => id.toString() !== user._id.toString()
    );
    await resource.save();

    // Log the admin action
    await Audit.create({
      user: req.user._id,
      action: `Revoked access to ${resource.name} from ${user.name}`,
      ip: req.ip,
    });

    res.json({ message: `Access revoked from ${user.name} for ${resource.name}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
