import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI).then(() => console.log("DB Connected"));
}

// MongoDB connection string is now stored in .env file for security
// Do not use '@' symbol in your database user's password else it will show an error.