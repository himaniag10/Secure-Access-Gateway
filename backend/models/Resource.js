import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Finance App"
  description: { type: String },
  usersWithAccess: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // who can access
});

const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;
