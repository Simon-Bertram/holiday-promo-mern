import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { generateMagicCode, sendMagicCodeEmail } from "../utils/email.js";

// Stage 1: Request Magic Code (or password prompt for moderators/admins)
// route: POST /api/auth/request-code
// access: Public
export const requestMagicCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // For regular users, generate and sent a magic code
  if (user.role === "user") {
    const code = generateMagicCode();
    user.loginCode = code;
    user.loginCodeExpiry = Date.now() + 1000 * 60 * 30; // 30 minutes from now

    await user.save();
    await sendMagicCodeEmail(email, code);

    res.status(200).json({
      message: "Magic code sent to email",
      nextStep: "verify-magic-code",
    });
  } else {
    // For moderators/admins, send a password prompt
    res.status(200).json({
      message: "Password required",
      nextStep: "verify-password",
    });
  }
});

// Stage 2: Verify Magic Code
// route: POST /api/auth/verify-code
// access: Public
export const verifyMagicCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  console.log("Received verification request:", { email, code });

  const user = await User.findOne({ email });
  console.log("Found user:", {
    hasUser: !!user,
    storedCode: user?.loginCode,
    codeExpiry: user?.loginCodeExpiry,
    currentTime: Date.now(),
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.loginCode !== code || user.loginCodeExpiry < Date.now()) {
    console.log("Code validation failed:", {
      codesMatch: user.loginCode === code,
      isExpired: user.loginCodeExpiry < Date.now(),
    });
    res.status(400);
    throw new Error("Invalid or expired code");
  }

  // Clear the code after successful verification
  user.loginCode = undefined;
  user.loginCodeExpiry = undefined;
  await user.save();

  // Issue token and log in the regular user
  generateToken(res, user._id);
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    redirect: "/profile", // Regular users go to the profile page
  });
});

// Stage 2 (alternative): Password login for moderators/admins
// route: POST /api/auth/password-login
// access: Public
export const passwordLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Clear the code after successful verification
  user.loginCode = undefined;
  user.loginCodeExpiry = undefined;
  await user.save();

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
