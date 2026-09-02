import mongoose from 'mongoose';
import serverConfig from './server.config';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(serverConfig.mongoUri);
    console.log('Mongodb is connected!!!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;