import mongoose from "mongoose";

const monitorSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    timeout: {
      type: Number,
      required: true,
      min: 1
    },
    alertEmail: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["up", "down", "paused"],
      default: "up"
    },
    lastHeartbeat: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("Monitor", monitorSchema);