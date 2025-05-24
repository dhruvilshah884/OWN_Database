import mongoose from "mongoose";

export const dbConnectMiddleware = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
  }
};
