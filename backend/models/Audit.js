import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true }, // e.g., "Login", "Accessed Finance App"
  resource: { type: String }, // optional: which app/resource
  ip: { type: String },
  timestamp: { type: Date, default: Date.now },
  success: { type: Boolean, default: true }, // track failed logins too
});

const Audit = mongoose.model("Audit", auditSchema);
export default Audit;
