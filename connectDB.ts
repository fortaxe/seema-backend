import mongoose, { ConnectOptions } from 'mongoose';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  try {
    const opts: ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      family: 4,
    };

    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error('MONGO_URL environment variable is not defined');
    }

    await mongoose.connect(mongoUrl, opts);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Initial MongoDB connection error:', error);
    isConnected = false;
    throw error; // Throw error instead of exiting process in serverless environment
  }

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.error('MongoDB disconnected.');
  });

  mongoose.connection.on('error', (err) => {
    isConnected = false; 
    console.error('MongoDB connection error:', err);
  });
}; 
