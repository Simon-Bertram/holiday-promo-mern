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

// This route handles endpoints at the base path '/api/subscribers'
router
  .route("/")
  .get(getSubscribers) // GET /api/subscribers - Get all subscribers
  .post(createSubscriber); // POST /api/subscribers - Create a new subscriber

router
  .route("/:id")
  .get(getSubscriber) // GET /api/subscribers/:id - Get a single subscriber by ID
  .put(updateSubscriber) // PUT /api/subscribers/:id - Update a subscriber
  .delete(deleteSubscriber); // DELETE /api/subscribers/[id_or_email_or_name] - Delete a subscriber

export default router;
