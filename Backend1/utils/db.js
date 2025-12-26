import mongoose from 'mongoose';

// Disable buffering for serverless
mongoose.set('bufferCommands', false);
mongoose.set('bufferMaxEntries', 0);

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
      bufferMaxEntries: 0,
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connected for serverless');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};