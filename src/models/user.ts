import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      default: Math.floor(Math.random() * 1000000),
    },
    otp_expiry: {
      type: Date,
      default: Date.now() + 5 * 60 * 1000,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);
export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);
