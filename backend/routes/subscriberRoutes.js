import express from "express";
import {
  getSubscribers,
  getSubscriber,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber,
} from "../controllers/subscriberController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply both middlewares to all routes in this router.
// Only users with role 'moderator' or 'admin' will be allowed.
router.use(protect, authorizeRoles("moderator", "admin"));

router.route("/").get(getSubscribers).post(createSubscriber);

router
  .route("/:id")
  .get(getSubscriber)
  .put(updateSubscriber)
  .delete(deleteSubscriber);

export default router;
