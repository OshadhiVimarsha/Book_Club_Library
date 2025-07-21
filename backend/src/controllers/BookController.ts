import { BookModel } from "../models/Book"
import { APIError } from "../error/APIError";
import { NextFunction, Request, Response } from "express";

export const saveBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = new BookModel(req.body);
        await book.save()
        res.status(201).json(book)
    } catch (error:any) {
        // error handler
        next(error)
    }
}

// Get All books
export const getBooks = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const books = await BookModel.find()
        res.status(200).json(books)
    } catch (error:any) {
        next(error)
    }
}

// Get book by id
export const getBookById  = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const book = await BookModel.findById(req.params.id)
        console.log("book", book)
        if (!book) {
            throw new APIError(404, "Book not found")
        }
        res.status(200).json(book)
    } catch (error:any) {
        next(error)
    }
}

// delete book
export const deleteBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const deleteBook = await BookModel.findByIdAndDelete(req.params.id)
        if (!deleteBook) {
            throw new APIError(404, "Book not found")
        }
        res.status(200).json({message: `Book has been deleted`})
    } catch (error:any) {
        next(error)
    }
}

// update customer
export const updateBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const updateBook = await BookModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            // If true -> return the update customer
            // If false -> return the old customer
            runValidators: true,
        })
        if (!updateBook) {
            throw new APIError(404, "Book not found")
        }
        res.status(200).json({message: `Book has been updated`})
    } catch (error:any) {
        next(error)
    }
}