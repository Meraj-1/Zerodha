import User from '../models/User.js';
import { connectDB } from '../utils/db.js';

export const updateProfile = async (req, res) => {
  try {
    await connectDB();
    
    const { phone, gender, name } = req.body;
    const userId = req.user.id || req.user._id;
    
    const updateData = {};
    if (phone) updateData.phone = phone;
    if (gender) updateData.gender = gender;
    if (name) updateData.name = name;
    
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