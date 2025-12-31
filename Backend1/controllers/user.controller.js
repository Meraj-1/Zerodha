import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
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

export const addFunds = async (req, res) => {
  try {
    await connectDB();
    
    const { amount, method = 'UPI' } = req.body;
    const userId = req.user.id || req.user._id;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const newBalance = user.balance + amount;
    
    await User.findByIdAndUpdate(userId, { balance: newBalance });
    
    await Transaction.create({
      userId,
      userEmail: user.email,
      type: 'credit',
      amount,
      description: `Funds added via ${method}`,
      balanceAfter: newBalance
    });
    
    res.json({
      message: 'Funds added successfully',
      balance: newBalance,
      transaction: {
        type: 'credit',
        amount,
        method,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Add funds error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const withdrawFunds = async (req, res) => {
  try {
    await connectDB();
    
    const { amount, method = 'Bank Transfer' } = req.body;
    const userId = req.user.id || req.user._id;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    const newBalance = user.balance - amount;
    
    await User.findByIdAndUpdate(userId, { balance: newBalance });
    
    await Transaction.create({
      userId,
      userEmail: user.email,
      type: 'debit',
      amount,
      description: `Funds withdrawn via ${method}`,
      balanceAfter: newBalance
    });
    
    res.json({
      message: 'Funds withdrawn successfully',
      balance: newBalance,
      transaction: {
        type: 'debit',
        amount,
        method,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Withdraw funds error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTransactionHistory = async (req, res) => {
  try {
    await connectDB();
    
    const userId = req.user.id || req.user._id;
    const { page = 1, limit = 20 } = req.query;
    
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Transaction.countDocuments({ userId });
    
    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get transaction history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBalance = async (req, res) => {
  try {
    await connectDB();
    
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId).select('balance');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ balance: user.balance });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};