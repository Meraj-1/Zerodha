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

// Test route to check if server is working
router.get("/test", async (req, res) => {
  let dbStatus = "Not tested";
  let dbError = null;
  
  try {
    // Test database connection
    const { connectDB } = await import("../utils/db.js");
    await connectDB();
    
    // Try to query database
    const testUser = await User.findOne({}).limit(1);
    dbStatus = testUser ? "Connected with data" : "Connected but no users";
  } catch (error) {
    dbStatus = "Connection failed";
    dbError = error.message;
  }
  
  res.json({ 
    message: "Auth routes working", 
    timestamp: new Date().toISOString(),
    env: {
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasMongoUri: !!process.env.MONGO_URI
    },
    database: {
      status: dbStatus,
      error: dbError
    }
  });
});

// Regular signup/login routes
router.post("/signup", signup);
router.post("/login", login);

//start login - Manual OAuth URL
// router.get("/google", (req, res) => {
//   const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?` +
//     `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
//     `redirect_uri=${encodeURIComponent('https://kitebackend.vercel.app/auth/google/callback')}&` +
//     `response_type=code&` +
//     `scope=${encodeURIComponent('openid profile email')}&` +
//     `access_type=offline&` +
//     `prompt=consent`;
  
//   console.log('Redirecting to Google OAuth:', googleAuthURL);
//   res.redirect(googleAuthURL);
// });

router.get("/google", (req, res) => {
  const googleAuthURL =
    "https://accounts.google.com/o/oauth2/auth?" +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    "response_type=code&" +
    `redirect_uri=${encodeURIComponent(
      "https://kitebackend.vercel.app/auth/google/callback"
    )}&` +
    "scope=openid%20email%20profile&" +
    "access_type=offline&" +
    "prompt=consent";

  console.log("🔵 Google OAuth URL:", googleAuthURL);
  res.redirect(googleAuthURL);
});

//google callback
router.get(
  "/google/callback",
  (req, res, next) => {
    console.log('Google callback received:', {
      query: req.query,
      hasCode: !!req.query.code,
      hasError: !!req.query.error
    });
    
    if (req.query.error) {
      console.error('Google OAuth error:', req.query.error);
      return res.redirect('https://dashboardclone.vercel.app/auth?error=google_oauth_error');
    }
    
    next();
  },
  passport.authenticate("google", {
    failureRedirect: "https://dashboardclone.vercel.app/auth?error=passport_failed"
  }),
  (req, res) => {
    try {
      console.log('OAuth callback success, user:', req.user ? 'Found' : 'Not found');
      
      if (!req.user) {
        console.error('No user found after authentication');
        return res.redirect('https://dashboardclone.vercel.app/auth?error=no_user_created');
      }
      
      console.log('Generating token for user:', req.user._id);
      
      // Generate JWT token with full user data
      const tokenPayload = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        role: req.user.role || 'user',
        isGoogleUser: true
      };
      
      const token = generateToken(tokenPayload);
      
      console.log('Token generated with user data, redirecting to profile');
      
      // Redirect to frontend with token
      res.redirect(`https://dashboardclone.vercel.app/profile?token=${token}`);
    } catch (error) {
      console.error('OAuth callback processing error:', error);
      res.redirect('https://dashboardclone.vercel.app/auth?error=callback_processing_failed');
    }
  }
);

// Simple test callback without passport
router.get("/google/test-callback", async (req, res) => {
  try {
    console.log('Test callback hit with code:', req.query.code ? 'YES' : 'NO');
    
    // Test database connection
    const testUser = await User.findOne({}).limit(1);
    console.log('Database test:', testUser ? 'Connected' : 'No users found');
    
    res.json({
      message: 'Test callback working',
      hasCode: !!req.query.code,
      dbConnected: !!testUser || 'No users but connected'
    });
  } catch (error) {
    console.error('Test callback error:', error);
    res.status(500).json({ error: error.message });
  }
});


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
      updateData.avatar = `https://kitebackend.vercel.app/uploads/avatars/${req.file.filename}`;
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
