import mongoose from "mongoose";

const connectDB = async () => {
  
  //debugging: log the MONGO_URI to ensure it's being read correctly
  console.log("URI being used:", process.env.MONGO_URI ? "Found" : "Undefined");

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
