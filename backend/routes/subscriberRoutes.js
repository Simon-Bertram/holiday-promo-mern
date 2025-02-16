import express from "express";
import { getSubscribers } from "../controllers/subscriberController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getSubscribers);

export default router;
