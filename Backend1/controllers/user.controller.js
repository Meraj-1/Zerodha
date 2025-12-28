import User from '../models/User.js';
import { connectDB } from '../utils/db.js';
import { generateOTP, storeOTP, verifyOTP, sendOTP } from '../services/otp.service.js';

export const updateProfile = async (req, res) => {
  try {
    await connectDB();
    
    const { phone, gender, name } = req.body;
    const userId = req.user.id || req.user._id;
    
    const updateData = {};
    if (gender) updateData.gender = gender;
    if (name) updateData.name = name;
    
    // Don't update phone directly - it needs verification
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
        balance: user.balance,
        isPhoneVerified: user.isPhoneVerified
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendPhoneOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone || phone.length < 10) {
      return res.status(400).json({ message: 'Valid phone number required' });
    }
    
    const otp = generateOTP();
    storeOTP(phone, otp);
    
    const smsResult = await sendOTP(phone, otp);
    
    res.json({
      message: 'OTP sent successfully',
      // In demo mode, return OTP for testing
      ...(process.env.NODE_ENV !== 'production' && { demoOTP: otp })
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

export const verifyPhoneOTP = async (req, res) => {
  try {
    await connectDB();
    
    const { phone, otp } = req.body;
    const userId = req.user.id || req.user._id;
    
    const verification = verifyOTP(phone, otp);
    
    if (!verification.success) {
      return res.status(400).json({ message: verification.message });
    }
    
    // Update user with verified phone
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        phone: phone,
        isPhoneVerified: true
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'Phone number verified and updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        avatar: user.avatar,
        role: user.role,
        balance: user.balance,
        isPhoneVerified: user.isPhoneVerified
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};