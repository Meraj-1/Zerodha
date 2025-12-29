import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Import blacklist functions from auth routes
let isTokenBlacklisted;
try {
  // This will be set by the auth routes
  isTokenBlacklisted = global.isTokenBlacklisted || (() => false);
} catch (e) {
  isTokenBlacklisted = () => false;
}

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if token is blacklisted
    if (global.isTokenBlacklisted && global.isTokenBlacklisted(token)) {
      return res.status(401).json({ message: "Token has been invalidated. Please login again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('JWT decoded:', decoded);

    // Handle Google OAuth users (they have user data in token)
    if (decoded.isGoogleUser || (decoded.id && decoded.id.startsWith('google_'))) {
      req.user = {
        _id: decoded.id,
        name: decoded.name || 'Google User',
        email: decoded.email || 'user@gmail.com',
        avatar: decoded.avatar || 'https://ui-avatars.com/api/?name=Google+User&background=random&color=fff&size=128',
        role: decoded.role || 'user',
        phone: null,
        gender: null,
        isGoogleConnected: true,
        balance: 0
      };
      console.log('Google user authenticated:', req.user.name, req.user.email);
      return next();
    }

    // Handle regular users
    try {
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
    } catch (dbError) {
      // If database fails, create minimal user object
      req.user = {
        _id: decoded.id,
        name: 'User',
        email: 'user@example.com',
        balance: 0,
        role: 'user'
      };
    }

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: "Invalid token" });
  }
};