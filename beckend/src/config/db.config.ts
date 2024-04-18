import mongoose from "mongoose";
import keys from "./keys";

const connectDB = (url: any):void => {
  mongoose.connect(keys.mongoURI);
};

export default connectDB;
