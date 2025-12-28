import User from '../models/User.js';
import { connectDB } from '../utils/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/avatars';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

export const updateProfile = async (req, res) => {
  try {
    await connectDB();
    
    const { phone, gender, name } = req.body;
    const userId = req.user.id;
    
    const updateData = {};
    if (phone) updateData.phone = phone;
    if (gender) updateData.gender = gender;
    if (name) updateData.name = name;
    
    // Handle avatar upload
    if (req.file) {
      updateData.avatar = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        avatar: user.avatar,
        role: user.role,
        balance: user.balance
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};