import mongoose from "mongoose";

type Reader = {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    joinedDate?: Date;
    isActive: boolean;
};

const readerSchema = new mongoose.Schema<Reader>({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/  // simple email regex
    },
    phone: {
        type: String,
        trim: true,
        match: /^[0-9]{10}$/  // SL 10-digit phone number
    },
    address: {
        type: String,
        trim: true
    },
    joinedDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

export const ReaderModel = mongoose.model("Reader", readerSchema);