
import mongoose from "mongoose";

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not defined in environment variables."
    );
  }

  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    /*await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });*/

    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error
    );

    throw error;
  }
}

