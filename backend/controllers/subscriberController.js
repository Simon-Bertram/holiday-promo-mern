import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";

// @desc: fetch all subscribers
// route: GET /api/subscribers
// access: Private - accessible to moderators and admins only
const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await User.find({ role: "user" });
  res.status(200).json(subscribers);
});

// @desc    Get a single subscriber
// @route   GET /api/subscribers/:id
// @access  Private - accessible to moderators and admins only

// @desc    Create a new subscriber
// @route   POST /api/subscribers
// @access  Private (protected via middleware)

// @desc    Update a subscriber
// @route   PUT /api/subscribers/:id
// @access  Private (protected via middleware)

// @desc    Delete a subscriber
// @route   DELETE /api/subscribers/:id
// @access  Private (protected via middleware)

export { getSubscribers };
