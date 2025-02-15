import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminMiddleware.js";
import { getDashboardData } from "../controllers/adminController.js";

const router = express.Router();

// This endpoint is accessible only by users whose role is 'admin' or 'moderator'
router.get("/dashboard-data", protect, adminProtect, getDashboardData);

export default router;
