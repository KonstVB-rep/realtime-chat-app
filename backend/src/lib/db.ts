import mongoose from "mongoose";

export async function connectDB() {
    if (!process.env.MONGO_URI) throw new Error("No URI");
    const connect = await mongoose.connect(process.env.MONGO_URI);
       console.log("MongoDB host:",connect.connection.host)
    return connect
}