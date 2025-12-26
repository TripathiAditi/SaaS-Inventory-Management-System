import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      unique: true,
    },

    defaultLowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
