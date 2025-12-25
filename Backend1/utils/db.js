import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connected for serverless');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};