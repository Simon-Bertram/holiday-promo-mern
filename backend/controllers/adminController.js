import asyncHandler from "express-async-handler";

export const getDashboardData = asyncHandler(async (req, res) => {
  // This data is sensitive and only returned after backend authorization checks
  res.status(200).json({ message: "Secret admin data" });
});
