import { connectDB } from '../utils/db.js';
import User from '../models/User.js';

export const testDB = async (req, res) => {
  try {
    console.log('Testing database connection...');
    await connectDB();
    console.log('Database connected successfully');
    
    const userCount = await User.countDocuments();
    console.log('Total users in database:', userCount);
    
    const users = await User.find({}).limit(5).select('name email createdAt');
    console.log('Recent users:', users);
    
    res.json({
      success: true,
      message: 'Database connection successful',
      userCount,
      recentUsers: users
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
};