import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected dashboard route
router.get("/", authMiddleware, getDashboardStats);

export default router;
