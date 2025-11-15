import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Audit from "../models/Audit.js";
import User from "../models/User.js";
import Resource from "../models/Resource.js";

const router = express.Router();

// Middleware: only admin access
const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

// @route GET /api/admin/audit-logs
// @desc Get all audit logs grouped by date
// @access Private/Admin
router.get("/audit-logs", protect, adminOnly, async (req, res) => {
  try {
    const logs = await Audit.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    // Group by date (YYYY-MM-DD)
    const grouped = logs.reduce((acc, log) => {
      const date = log.createdAt ? log.createdAt.toISOString().split("T")[0] : "Unknown";
      if (!acc[date]) acc[date] = [];
      acc[date].push(log);
      return acc;
    }, {});

    res.json(grouped);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== RESOURCE MANAGEMENT ====================

// @route GET /api/admin/resources
// @desc Get all resources with user access info
// @access Private/Admin
router.get("/resources", protect, adminOnly, async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate("usersWithAccess", "name email role")
      .populate("createdBy", "name email");

    res.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route POST /api/admin/resources
// @desc Create a new resource
// @access Private/Admin
router.post("/resources", protect, adminOnly, async (req, res) => {
  try {
    const { name, description, url } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    const resource = await Resource.create({
      name,
      description,
      url,
      usersWithAccess: [],
      createdBy: req.user._id,
    });

    // Audit log
    await Audit.create({
      user: req.user._id,
      action: `Created resource: ${resource.name}`,
      ip: req.ip || req.connection?.remoteAddress || "unknown",
      success: true,
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error("Error creating resource:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route PUT /api/admin/resources/:id
// @desc Update a resource
// @access Private/Admin
router.put("/resources/:id", protect, adminOnly, async (req, res) => {
  try {
    const { name, description, url } = req.body;

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    resource.name = name || resource.name;
    resource.description = description || resource.description;
    resource.url = url !== undefined ? url : resource.url;

    await resource.save();

    // Audit log
    await Audit.create({
      user: req.user._id,
      action: `Updated resource: ${resource.name}`,
      ip: req.ip || req.connection?.remoteAddress || "unknown",
      success: true,
    });

    res.json(resource);
  } catch (error) {
    console.error("Error updating resource:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route DELETE /api/admin/resources/:id
// @desc Delete a resource
// @access Private/Admin
router.delete("/resources/:id", protect, adminOnly, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const resourceName = resource.name;
    await resource.deleteOne();

    // Audit log
    await Audit.create({
      user: req.user._id,
      action: `Deleted resource: ${resourceName}`,
      ip: req.ip || req.connection?.remoteAddress || "unknown",
      success: true,
    });

    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== ACCESS MANAGEMENT ====================

// @route GET /api/admin/users
// @desc Get all users (for access management)
// @access Private/Admin
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route POST /api/admin/grant-access
// @desc Grant a user access to a resource
// @access Private/Admin
router.post("/grant-access", protect, adminOnly, async (req, res) => {
  try {
    const { userId, resourceId } = req.body;

    console.log("Grant access request:", { userId, resourceId });

    if (!userId || !resourceId) {
      return res.status(400).json({ message: "User ID and Resource ID are required" });
    }

    const user = await User.findById(userId);
    const resource = await Resource.findById(resourceId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Check if user already has access
    const hasAccess = resource.usersWithAccess.some(
      (id) => id.toString() === userId.toString()
    );

    if (hasAccess) {
      return res.status(400).json({ message: "User already has access to this resource" });
    }

    // Grant access
    resource.usersWithAccess.push(user._id);
    await resource.save();

    console.log("Access granted successfully");

    // Audit log
    await Audit.create({
      user: req.user._id,
      action: `Granted access to ${resource.name} for ${user.name}`,
      ip: req.ip || req.connection?.remoteAddress || "unknown",
      success: true,
    });

    res.json({ 
      message: `Access granted to ${user.name} for ${resource.name}`,
      resource: await Resource.findById(resourceId).populate("usersWithAccess", "name email")
    });
  } catch (error) {
    console.error("Grant access error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route POST /api/admin/revoke-access
// @desc Revoke a user's access to a resource
// @access Private/Admin
router.post("/revoke-access", protect, adminOnly, async (req, res) => {
  try {
    const { userId, resourceId } = req.body;

    console.log("Revoke access request:", { userId, resourceId });

    if (!userId || !resourceId) {
      return res.status(400).json({ message: "User ID and Resource ID are required" });
    }

    const user = await User.findById(userId);
    const resource = await Resource.findById(resourceId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Revoke access
    resource.usersWithAccess = resource.usersWithAccess.filter(
      (id) => id.toString() !== userId.toString()
    );
    await resource.save();

    console.log("Access revoked successfully");

    // Audit log
    await Audit.create({
      user: req.user._id,
      action: `Revoked access to ${resource.name} from ${user.name}`,
      ip: req.ip || req.connection?.remoteAddress || "unknown",
      success: true,
    });

    res.json({ 
      message: `Access revoked from ${user.name} for ${resource.name}`,
      resource: await Resource.findById(resourceId).populate("usersWithAccess", "name email")
    });
  } catch (error) {
    console.error("Revoke access error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;