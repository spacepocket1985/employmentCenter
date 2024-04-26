import connectDB from "../config/db.config";

export const startDB = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('Mongodb is connected!!!');

  } catch (error) {
    console.log(error);
  }
};

