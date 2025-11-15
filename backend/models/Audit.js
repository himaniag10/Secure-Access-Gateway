import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true },
  ip: { type: String },
  success: { type: Boolean, default: true },
}, { timestamps: true }); 

const Audit = mongoose.model("Audit", auditSchema);
export default Audit;
