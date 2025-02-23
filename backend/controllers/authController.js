import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { generateMagicCode, sendMagicCodeEmail } from "../utils/email.js";

// Stage 1: Request Magic Code
// route: POST /api/auth/request-code
// access: Public
export const requestMagicCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Generate and send magic code for all users
  const code = generateMagicCode();
  user.loginCode = code;
  user.loginCodeExpiry = Date.now() + 1000 * 60 * 30; // 30 minutes from now

  await user.save();
  await sendMagicCodeEmail(email, code);

  res.status(200).json({
    message: "Magic code sent to email",
    nextStep: "verify-magic-code",
  });
});

// Stage 2: Verify Magic Code handling different user roles
// route: POST /api/auth/verify-code
// access: Public
export const verifyMagicCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.loginCode !== code || user.loginCodeExpiry < Date.now()) {
    res.status(400);
    throw new Error("Invalid or expired code");
  }

  // Clear the code after successful verification
  user.loginCode = undefined;
  user.loginCodeExpiry = undefined;
  await user.save();

  if (user.role === "user") {
    // For regular users, generate token and complete login
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      redirect: "/profile",
    });
  } else {
    // For admin/moderator, require password
    res.status(200).json({
      message: "Password required",
      nextStep: "verify-password",
      email: user.email,
      role: user.role,
    });
  }
});

// Stage 3: Password login for moderators/admins
// route: POST /api/auth/password
// access: Public
export const passwordLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (await user.matchPassword(password)) {
    generateToken(res, user._id);
    // Redirect based on role: moderators/admins get a dashboard
    const redirectUrl = user.role === "user" ? "/profile" : "/dashboard";
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      redirect: redirectUrl,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});
