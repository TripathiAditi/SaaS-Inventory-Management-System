import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settings.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected settings routes
router.get("/", authMiddleware, getSettings);
router.put("/", authMiddleware, updateSettings);

export default router;
