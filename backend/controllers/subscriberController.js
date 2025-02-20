import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";

// @desc: fetch all subscribers
// route: GET /api/subscribers
// access: Private - accessible to moderators and admins only
const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await User.find({ role: "user" }).select(
    "name email isVerified"
  );
  if (!subscribers) {
    res.status(404);
    throw new Error("Problem fetching subscribers");
  }
  res.status(200).json(subscribers);
});

// @desc    Get a single subscriber
// @route   GET /api/subscribers/:id
// @access  Private - accessible to moderators and admins only
const getSubscriber = asyncHandler(async (req, res) => {
  const subscriber = await User.findById(req.params.id, {
    role: "user",
  }).select("name email isVerified");
  if (!subscriber) {
    res.status(404);
    throw new Error("Problem fetching subscriber");
  }
  res.status(200).json(subscriber);
});

// @desc    Create a new subscriber
// @route   POST /api/subscribers
// @access  Private (protected via middleware)
const createSubscriber = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const subscriber = await User.create({ name, email, role: "user" });
  res.status(201).json(subscriber);
});

// @desc    Update a subscriber
// @route   PUT /api/subscribers/:id
// @access  Private (protected via middleware)
const updateSubscriber = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const subscriber = await User.findByIdAndUpdate(
    req.params.id,
    { name, email },
    { new: true }
  );
  res.status(200).json(subscriber);
});
// @route   DELETE /api/subscribers/:id
// @access  Private (protected via middleware)
const deleteSubscriber = asyncHandler(async (req, res) => {
  const subscriber = await User.findByIdAndDelete(req.params.id);
  res.status(200).json(subscriber);
});

export {
  getSubscribers,
  getSubscriber,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber,
};
