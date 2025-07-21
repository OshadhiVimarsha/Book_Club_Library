import mongoose from "mongoose";

type Book = {
    title: string;
    author: string;
    description: string;
    language: string;
}

const bookSchema = new mongoose.Schema<Book>({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    author: {
        type: String,
        required: [true, "Author is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: 10
    },
    language: {
        type: String,
        required: [true, "Language is required"]
    },
})

export const BookModel = mongoose.model("Book", bookSchema);