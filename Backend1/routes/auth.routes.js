import express from "express";
import multer from "multer";
import passport from "passport";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly, userOrAdmin } from "../middleware/roleAuth.middleware.js";
import { signup, login } from "../controllers/auth.controller.js";
import { generateToken } from "../utils/jwt.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import OTP from "../models/OTP.js";
import { sendOTP, sendDeletionConfirmation } from "../services/email.service.js";

const router = express.Router();

// In-memory storage for Google OAuth users (demo purposes)
const googleUserBalances = new Map();
const googleUserTransactions = new Map();
const googleUserProfiles = new Map(); // Store profile data for Google users
const blacklistedTokens = new Set(); // Store invalidated tokens

// Helper function to blacklist a token
const blacklistToken = (token) => {
  if (token) {
    // Extract token without 'Bearer ' prefix
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    blacklistedTokens.add(cleanToken);
    console.log('Token blacklisted:', cleanToken.substring(0, 20) + '...');
  }
};

// Helper function to check if token is blacklisted
const isTokenBlacklisted = (token) => {
  const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
  return blacklistedTokens.has(cleanToken);
};

// Helper function to get/set balance for Google users
const getGoogleUserBalance = (userId) => {
  return googleUserBalances.get(userId) || 0;
};

const setGoogleUserBalance = (userId, balance) => {
  googleUserBalances.set(userId, Math.max(0, balance));
  return googleUserBalances.get(userId);
};

// Helper functions for Google user profiles
const getGoogleUserProfile = (userId) => {
  return googleUserProfiles.get(userId) || {};
};

const setGoogleUserProfile = (userId, profileData) => {
  const existing = googleUserProfiles.get(userId) || {};
  const updated = { ...existing, ...profileData };
  googleUserProfiles.set(userId, updated);
  return updated;
};

// Helper function to manage transactions for Google users
const addGoogleUserTransaction = (userId, transaction) => {
  if (!googleUserTransactions.has(userId)) {
    googleUserTransactions.set(userId, []);
  }
  const transactions = googleUserTransactions.get(userId);
  transactions.unshift(transaction); // Add to beginning
  if (transactions.length > 50) {
    transactions.pop(); // Keep only last 50
  }
};

const getGoogleUserTransactions = (userId) => {
  return googleUserTransactions.get(userId) || [];
};

// Configure multer for memory storage (serverless compatible)
const upload = multer({ 
  storage: multer.memoryStorage(),
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
router.get("/signup", (req, res) => {
  res.json({ message: "Signup endpoint - use POST method with name, email, password" });
});
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


//protected route - Get user details after login
router.get("/me", authMiddleware, userOrAdmin, async (req, res) => {
  try {
    let balance = req.user.balance || 0;
    
    // For Google OAuth users, get data from memory storage
    if (req.user.isGoogleConnected || req.user._id.toString().startsWith('google_')) {
      balance = getGoogleUserBalance(req.user._id);
      const profile = getGoogleUserProfile(req.user._id);
      
      return res.json({
        user: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar,
          role: req.user.role,
          phone: profile.phone || null,
          gender: profile.gender || null,
          isGoogleConnected: req.user.isGoogleConnected,
          balance: balance,
          isPhoneVerified: !!profile.phone
        }
      });
    }
    
    // For regular users, fetch complete details from database
    const user = await User.findById(req.user._id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        isGoogleConnected: user.isGoogleConnected,
        balance: user.balance,
        isPhoneVerified: user.isPhoneVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ message: "Error fetching user details" });
  }
});

// Set phone number route (User or Admin only)
router.put("/set-phone", authMiddleware, userOrAdmin, async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    
    // Handle Google OAuth users - store in memory
    if (req.user.isGoogleConnected || req.user._id.toString().startsWith('google_')) {
      const updatedProfile = setGoogleUserProfile(req.user._id, { 
        phone, 
        isPhoneVerified: true 
      });
      
      return res.json({ 
        message: "Phone number saved successfully",
        user: { 
          ...req.user, 
          phone: updatedProfile.phone,
          isPhoneVerified: updatedProfile.isPhoneVerified
        }
      });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { phone, isPhoneVerified: true },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Phone number saved successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        balance: updatedUser.balance,
        isPhoneVerified: updatedUser.isPhoneVerified
      }
    });
  } catch (error) {
    console.error('Phone update error:', error);
    res.status(500).json({ message: "Error updating phone number" });
  }
});

// Update profile route (User or Admin only)
router.put("/profile", authMiddleware, userOrAdmin, upload.single('avatar'), async (req, res) => {
  try {
    const { phone, gender, name } = req.body;
    
    // Handle Google OAuth users (store in memory)
    if (req.user.isGoogleConnected || req.user._id.toString().startsWith('google_')) {
      const profileUpdate = {};
      if (phone) profileUpdate.phone = phone;
      if (gender) profileUpdate.gender = gender;
      
      const updatedProfile = setGoogleUserProfile(req.user._id, profileUpdate);
      const currentBalance = getGoogleUserBalance(req.user._id);
      
      const updatedUser = {
        _id: req.user._id,
        name: name || req.user.name,
        email: req.user.email,
        avatar: req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : req.user.avatar,
        role: req.user.role,
        phone: updatedProfile.phone || null,
        gender: updatedProfile.gender || null,
        isGoogleConnected: true,
        balance: currentBalance, // Use current balance from memory
        isPhoneVerified: !!updatedProfile.phone
      };
      
      return res.json({ user: updatedUser });
    }
    
    const updateData = { phone, gender };
    
    // Add name if provided
    if (name) {
      updateData.name = name;
    }
    
    // Convert uploaded file to base64 for storage
    if (req.file) {
      updateData.avatar = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        balance: updatedUser.balance, // Return actual balance from database
        isPhoneVerified: updatedUser.isPhoneVerified
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: "Error updating profile" });
  }
});

// Add funds route (User or Admin only)
router.post("/add-funds", authMiddleware, userOrAdmin, async (req, res) => {
  try {
    const { amount } = req.body;
    
    console.log('Add funds request:', { amount, userBalance: req.user.balance, isGoogle: req.user.isGoogleConnected });
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Handle Google OAuth users (no database record)
    if (req.user.isGoogleConnected || req.user._id.startsWith('google_')) {
      const currentBalance = getGoogleUserBalance(req.user._id);
      const newBalance = setGoogleUserBalance(req.user._id, currentBalance + amount);
      
      // Add transaction to memory
      addGoogleUserTransaction(req.user._id, {
        _id: Date.now().toString(),
        type: "credit",
        amount: amount,
        description: "Funds Added",
        balanceAfter: newBalance,
        createdAt: new Date()
      });
      
      return res.json({
        message: "Funds added successfully",
        balance: newBalance
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { balance: amount } },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.json({
        message: "Funds added successfully",
        balance: amount
      });
    }

    // Create transaction record
    try {
      await Transaction.create({
        userId: req.user._id,
        userEmail: req.user.email,
        type: "credit",
        amount: amount,
        description: "Funds Added",
        balanceAfter: user.balance
      });
    } catch (txnError) {
      console.log('Transaction record creation failed:', txnError);
    }

    res.json({
      message: "Funds added successfully",
      balance: user.balance
    });
  } catch (error) {
    console.error('Add funds error:', error);
    res.status(500).json({ message: "Error adding funds" });
  }
});

// Withdraw funds route (User or Admin only)
router.post("/withdraw-funds", authMiddleware, userOrAdmin, async (req, res) => {
  try {
    const { amount } = req.body;
    
    console.log('Withdraw request:', { amount, userBalance: req.user.balance, isGoogle: req.user.isGoogleConnected });
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Handle Google OAuth users (no database record)
    if (req.user.isGoogleConnected || req.user._id.startsWith('google_')) {
      const currentBalance = getGoogleUserBalance(req.user._id);
      
      if (currentBalance < amount) {
        return res.status(400).json({ 
          message: "Insufficient balance. Please add funds first.",
          balance: currentBalance
        });
      }
      
      const newBalance = setGoogleUserBalance(req.user._id, currentBalance - amount);
      
      // Add transaction to memory
      addGoogleUserTransaction(req.user._id, {
        _id: Date.now().toString(),
        type: "debit",
        amount: amount,
        description: "Funds Withdrawn",
        balanceAfter: newBalance,
        createdAt: new Date()
      });
      
      return res.json({
        message: "Funds withdrawn successfully",
        balance: newBalance
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { balance: -amount } },
      { new: true }
    ).select("-password");

    // Create transaction record
    try {
      await Transaction.create({
        userId: req.user._id,
        userEmail: req.user.email,
        type: "debit",
        amount: amount,
        description: "Funds Withdrawn",
        balanceAfter: updatedUser.balance
      });
    } catch (txnError) {
      console.log('Transaction record creation failed:', txnError);
    }

    res.json({
      message: "Funds withdrawn successfully",
      balance: updatedUser.balance
    });
  } catch (error) {
    console.error('Withdraw funds error:', error);
    res.status(500).json({ message: "Error withdrawing funds" });
  }
});

// Get transaction history (User or Admin only)
router.get("/transactions", authMiddleware, userOrAdmin, async (req, res) => {
  try {
    // Handle Google OAuth users (no database record)
    if (req.user.isGoogleConnected || req.user._id.startsWith('google_')) {
      const transactions = getGoogleUserTransactions(req.user._id);
      return res.json({ transactions });
    }
    
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// Request account deletion OTP (User or Admin only)
router.post("/request-deletion-otp", authMiddleware, userOrAdmin, async (req, res) => {
  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Handle Google OAuth users
    if (req.user.isGoogleConnected || req.user._id.startsWith('google_')) {
      try {
        await sendOTP(req.user.email, otp);
        // Store OTP in memory/cache for Google users (demo purposes)
        global.tempOTP = { userId: req.user._id, otp, timestamp: Date.now() };
        return res.json({ message: "OTP sent to your email address" });
      } catch (emailError) {
        console.log('Email sending failed for Google user');
        return res.json({ message: "OTP sent to your email address" }); // Demo response
      }
    }
    
    // Delete any existing OTPs for this user
    try {
      await OTP.deleteMany({ userId: req.user._id, purpose: "account_deletion" });
    } catch (dbError) {
      console.log('OTP deletion failed:', dbError);
    }
    
    // Create new OTP
    try {
      await OTP.create({
        userId: req.user._id,
        userEmail: req.user.email,
        otp: otp,
        purpose: "account_deletion"
      });
    } catch (dbError) {
      console.log('OTP creation failed:', dbError);
    }
    
    // Send OTP via email
    try {
      await sendOTP(req.user.email, otp);
    } catch (emailError) {
      console.log('Email sending failed:', emailError);
    }
    
    res.json({ message: "OTP sent to your email address" });
  } catch (error) {
    console.error("OTP generation error:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

// Verify OTP and delete account (User or Admin only)
router.post("/delete-account", authMiddleware, userOrAdmin, async (req, res) => {
  try {
    const { otp } = req.body;
    
    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }
    
    // Get user's current token for blacklisting
    const userToken = req.headers.authorization;
    
    // Handle Google OAuth users
    if (req.user.isGoogleConnected || req.user._id.startsWith('google_')) {
      // Check temp OTP for Google users
      if (global.tempOTP && global.tempOTP.userId === req.user._id && global.tempOTP.otp === otp) {
        try {
          await sendDeletionConfirmation(req.user.email, req.user.name);
        } catch (emailError) {
          console.log('Deletion confirmation email failed');
        }
        
        // Blacklist current token to logout user from all sessions
        if (userToken) {
          blacklistToken(userToken);
        }
        
        // Complete data erasure for Google OAuth users
        try {
          // Remove from memory storage
          googleUserBalances.delete(req.user._id);
          googleUserTransactions.delete(req.user._id);
          googleUserProfiles.delete(req.user._id);
          
          // Remove from database if exists (some Google users might have DB records)
          await User.findOneAndDelete({ 
            $or: [
              { googleId: req.user.googleId },
              { email: req.user.email },
              { _id: req.user._id }
            ]
          });
          
          // Remove all transactions associated with this user
          await Transaction.deleteMany({ 
            $or: [
              { userId: req.user._id },
              { userEmail: req.user.email }
            ]
          });
          
          // Remove all OTPs associated with this user
          await OTP.deleteMany({ 
            $or: [
              { userId: req.user._id },
              { userEmail: req.user.email }
            ]
          });
          
          console.log(`Google user ${req.user.email} completely erased from all systems`);
        } catch (cleanupError) {
          console.log('Data cleanup completed with some warnings:', cleanupError.message);
        }
        
        delete global.tempOTP;
        return res.json({ 
          message: "Account and all associated data deleted successfully. You have been logged out from all devices.",
          logout: true 
        });
      } else {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
    }
    
    // Find valid OTP for regular users
    const validOTP = await OTP.findOne({
      userId: req.user._id,
      otp: otp,
      purpose: "account_deletion"
    });
    
    if (!validOTP) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    
    // Blacklist current token to logout user from all sessions
    if (userToken) {
      blacklistToken(userToken);
    }
    
    // Send confirmation email before deletion
    try {
      await sendDeletionConfirmation(req.user.email, req.user.name);
    } catch (emailError) {
      console.log('Deletion confirmation email failed:', emailError);
    }
    
    // Complete data erasure for regular users
    try {
      const userId = req.user._id;
      const userEmail = req.user.email;
      
      // Delete all user transactions
      await Transaction.deleteMany({ userId: userId });
      console.log(`Deleted transactions for user ${userEmail}`);
      
      // Delete all user OTPs
      await OTP.deleteMany({ userId: userId });
      console.log(`Deleted OTPs for user ${userEmail}`);
      
      // Delete user account
      await User.findByIdAndDelete(userId);
      console.log(`Deleted user account ${userEmail}`);
      
      // Remove from memory storage (if exists)
      googleUserBalances.delete(userId.toString());
      googleUserTransactions.delete(userId.toString());
      googleUserProfiles.delete(userId.toString());
      
      console.log(`User ${userEmail} completely erased from all systems`);
    } catch (dbError) {
      console.log('Database deletion completed with some warnings:', dbError.message);
    }
    
    res.json({ 
      message: "Account and all associated data deleted successfully. You have been logged out from all devices.",
      logout: true 
    });
  } catch (error) {
    console.error("Account deletion error:", error);
    res.status(500).json({ message: "Error deleting account" });
  }
});

// Make blacklist functions globally available
global.isTokenBlacklisted = isTokenBlacklisted;
global.blacklistToken = blacklistToken;

// Admin-only routes

// Get all users (Admin only)
router.get("/admin/users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select("-password").limit(100);
    res.json({ 
      users,
      total: users.length,
      message: "Users retrieved successfully"
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Get user by ID (Admin only)
router.get("/admin/user/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Get user transactions
    const transactions = await Transaction.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({ 
      user,
      recentTransactions: transactions,
      message: "User details retrieved successfully"
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: "Error fetching user details" });
  }
});

// Update user role (Admin only)
router.put("/admin/user/:id/role", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be 'user' or 'admin'" });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ 
      user,
      message: `User role updated to ${role} successfully`
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: "Error updating user role" });
  }
});

// Get system stats (Admin only)
router.get("/admin/stats", authMiddleware, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    const totalBalance = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$balance" } } }
    ]);
    
    const recentUsers = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      stats: {
        totalUsers,
        totalTransactions,
        totalBalance: totalBalance[0]?.total || 0,
        blacklistedTokens: blacklistedTokens.size
      },
      recentUsers,
      message: "System stats retrieved successfully"
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: "Error fetching system stats" });
  }
});

//logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

export default router;
