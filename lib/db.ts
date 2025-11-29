import mongoose from "mongoose";

const DB_URI = process.env.MONGODB_URI!;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(DB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error → ", error);
  }
}
