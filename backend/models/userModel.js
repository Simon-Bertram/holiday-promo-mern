import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, required: true, default: false },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    // Optional: track who modified the role
    roleModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    roleModifiedAt: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
