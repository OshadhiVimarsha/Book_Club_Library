import mongoose from "mongoose";

type Lending = {
    bookId: mongoose.Schema.Types.ObjectId;
    readerId: mongoose.Types.ObjectId;
    borrowedDate: Date;
    dueDate: Date;
    isReturned: boolean;
    returnedDate?: Date;
}

const lendingSchema = new mongoose.Schema<Lending>({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    readerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reader",
        required: true
    },
    borrowedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value: Date) {
                return value > new Date();
            },
            message: "Due date must be in the future"
        }
    },
    isReturned: {
        type: Boolean,
        required: true,
        default: false
    },
    returnedDate: {
        type: Date,
        validate: {
            validator: function (value: Date) {
                if (!value) return true; // Optional field
                return value <= new Date();
            },
            message: "Returned date cannot be in the future"
        }
    }
});

export const LendingModel = mongoose.model("Lending", lendingSchema);