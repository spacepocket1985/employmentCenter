import mongoose from "mongoose";

const connectDB = (url: any) => {
    mongoose.connect("mongodb://localhost:27017/employmentCenter");
}

export default connectDB