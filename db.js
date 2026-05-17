import mongoose from "mongoose";

export default async function connectDb() {
    
    if (mongoose.connections[0].readyState) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB database Connected");
    } catch (error) {
        console.error(error);
        throw new Error("database connection failed")
    }
}