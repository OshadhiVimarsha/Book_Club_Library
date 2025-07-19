import mongoose from "mongoose";

type User = {
    name: string,
    email: string,
    password: string
}

const userSchema = new mongoose.Schema<User>({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [2, "Name must be at least 2 characters"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        unique: [true, "Email must be unique"],
        index: true,
        lowercase: true,
        match: [/^[\w\-]+@([\w-]+\.)+[\w-]{2,}$/, "Please enter a valid email"]
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        trim: true
    }
})

export const UserModel = mongoose.model<User>("User", userSchema)

// OshiV@1221