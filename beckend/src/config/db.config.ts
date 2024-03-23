import mongoose from "mongoose";

const connectDB = (url: any) => {
    mongoose.connect("mongodb://localhost:27017/task_app");
}

export default connectDB