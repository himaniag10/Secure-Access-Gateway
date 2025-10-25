import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Resource name is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    url: {
      type: String,
    },
    usersWithAccess: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;