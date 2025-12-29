import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    userEmail: {
      type: String,
      required: false // Optional for backward compatibility
    },
    otp: {
      type: String,
      required: true
    },
    purpose: {
      type: String,
      enum: ["account_deletion"],
      required: true
    },
    expiresAt: {
      type: Date,
      default: Date.now,
      expires: 600 // 10 minutes
    }
  },
  { timestamps: true }
);

export default mongoose.model("OTP", otpSchema);