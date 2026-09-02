import connectDB from '../config/db.config';

export const startDB = async (): Promise<void> => {
  await connectDB();
};

export default startDB;
