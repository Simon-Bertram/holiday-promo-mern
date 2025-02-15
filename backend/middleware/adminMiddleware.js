import asyncHandler from "express-async-handler";

export const adminProtect = asyncHandler((req, res, next) => {
  // Check that req.user (set from verify JWT in your protect middleware)
  // has an allowed role (admin or moderator)
  if (
    req.user &&
    (req.user.role === "admin" || req.user.role === "moderator")
  ) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as admin or moderator");
  }
});
