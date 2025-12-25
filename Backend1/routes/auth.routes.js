import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import passport from "passport";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { signup, login } from "../controllers/auth.controller.js";
import { generateToken } from "../utils/jwt.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import OTP from "../models/OTP.js";
import { sendOTP, sendDeletionConfirmation } from "../services/email.service.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/avatars';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Regular signup/login routes
router.post("/signup", signup);
router.post("/login", login);

//start login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/auth",
  }),
  (req, res) => {
    // Generate JWT token for the user
    const token = generateToken(req.user._id);
    
    // Redirect to frontend with token
    res.redirect(`http://localhost:3000/profile?token=${token}`);
  }
);


//protected route
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      role: req.user.role,
      phone: req.user.phone,
      gender: req.user.gender,
      isGoogleConnected: req.user.isGoogleConnected,
      balance: req.user.balance || 0
    }
  });
});

// Update profile route
router.put("/profile", authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    const { phone, gender, name } = req.body;
    
    const updateData = { phone, gender };
    
    // Add name if provided
    if (name) {
      updateData.name = name;
    }
    
    // If avatar file is uploaded, add it to update data
    if (req.file) {
      updateData.avatar = `http://localhost:8000/uploads/avatars/${req.file.filename}`;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select("-password");

    res.json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        balance: updatedUser.balance
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

// Add funds route
router.post("/add-funds", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { balance: amount } },
      { new: true }
    ).select("-password");

    // Create transaction record
    await Transaction.create({
      userId: req.user._id,
      type: "credit",
      amount: amount,
      description: "Funds Added",
      balanceAfter: user.balance
    });

    res.json({
      message: "Funds added successfully",
      balance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding funds" });
  }
});

// Withdraw funds route
router.post("/withdraw-funds", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(req.user._id);
    
    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { balance: -amount } },
      { new: true }
    ).select("-password");

    // Create transaction record
    await Transaction.create({
      userId: req.user._id,
      type: "debit",
      amount: amount,
      description: "Funds Withdrawn",
      balanceAfter: updatedUser.balance
    });

    res.json({
      message: "Funds withdrawn successfully",
      balance: updatedUser.balance
    });
  } catch (error) {
    res.status(500).json({ message: "Error withdrawing funds" });
  }
});

// Get transaction history
router.get("/transactions", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// Request account deletion OTP
router.post("/request-deletion-otp", authMiddleware, async (req, res) => {
  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Delete any existing OTPs for this user
    await OTP.deleteMany({ userId: req.user._id, purpose: "account_deletion" });
    
    // Create new OTP
    await OTP.create({
      userId: req.user._id,
      otp: otp,
      purpose: "account_deletion"
    });
    
    // Send OTP via email
    await sendOTP(req.user.email, otp);
    
    res.json({ message: "OTP sent to your email address" });
  } catch (error) {
    console.error("OTP generation error:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

// Verify OTP and delete account
router.post("/delete-account", authMiddleware, async (req, res) => {
  try {
    const { otp } = req.body;
    
    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }
    
    // Find valid OTP
    const validOTP = await OTP.findOne({
      userId: req.user._id,
      otp: otp,
      purpose: "account_deletion"
    });
    
    if (!validOTP) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    
    // Send confirmation email before deletion
    await sendDeletionConfirmation(req.user.email, req.user.name);
    
    // Delete user data
    await Transaction.deleteMany({ userId: req.user._id });
    await OTP.deleteMany({ userId: req.user._id });
    await User.findByIdAndDelete(req.user._id);
    
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Account deletion error:", error);
    res.status(500).json({ message: "Error deleting account" });
  }
});

//logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

export default router;
