import mongoose from "mongoose";
import config from "./index.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
