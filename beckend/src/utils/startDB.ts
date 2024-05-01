import connectDB from "../config/db.config";
import keys from "../config/keys";

export const startDB = async (): Promise<void> => {
  try {
    await connectDB(keys.mongoURI);
    console.log("Mongodb is connected!!!");
  } catch (error) {
    console.log(error);
  }
};
