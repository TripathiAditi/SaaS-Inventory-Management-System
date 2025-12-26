import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    costPrice: {
      type: Number,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      min: 0,
    },

    lowStockThreshold: {
      type: Number,
      min: 0,
    },

    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

/**
 * SKU must be unique per organization
 */
productSchema.index(
  { organization: 1, sku: 1 },
  { unique: true }
);

export default mongoose.model("Product", productSchema);
