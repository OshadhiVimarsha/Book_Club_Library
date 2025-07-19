import mongoose from "mongoose";

export const connectDB = async () => {

    console.log(process.env.PORT);
    try {
        await mongoose.connect(process.env.DB_URI as string)
        console.log("MongoDB Connected")

    } catch (error) {
        console.error("Error Connecting to DB", error);
        process.exit(1);
    }
}