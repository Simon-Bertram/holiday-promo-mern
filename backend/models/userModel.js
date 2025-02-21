import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        // Password is only required for admin/moderator roles
        return ["admin", "moderator"].includes(this.role);
      },
    },
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
    // Fields for magic code login flow
    loginCode: { type: String },
    loginCodeExpiry: { type: Date },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // Only hash the password if it's been modified (or is new) AND exists
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
