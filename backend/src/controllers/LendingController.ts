import { Request, Response } from 'express';
import { LendingModel } from '../models/Lending';
import { BookModel } from '../models/Book';
import { ReaderModel } from '../models/Reader';
import { addDays } from 'date-fns';
import { APIError } from '../error/APIError';
import mongoose from "mongoose";

// Lend a book to a reader
export const lendBook = async (req: Request, res: Response) => {
    try {
        const { readerId, bookId } = req.body;
        if (!readerId || !bookId) {
            throw new APIError(400, 'Reader ID and Book ID are required');
        }

        const reader = await ReaderModel.findById(readerId);
        if (!reader) {
            throw new APIError(404, 'Reader not found');
        }

        const book = await BookModel.findById(bookId);
        if (!book) {
            throw new APIError(404, 'Book not found');
        }

        const existingLending = await LendingModel.findOne({ bookId, isReturned: false });
        if (existingLending) {
            throw new APIError(400, 'Book is already lent out');
        }

        const lending = new LendingModel({
            readerId,
            bookId,
            borrowedDate: new Date(),
            dueDate: addDays(new Date(), 14), // Due in 2 weeks
            isReturned: false,
        });

        await lending.save();
        res.status(201).json({ message: 'Book lent successfully', lending });
    } catch (error) {
        throw error;
    }
};

// Return a book
export const returnBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Lending record ID

        if (!mongoose.isValidObjectId(id)) {
            throw new APIError(400, 'Invalid lending ID');
        }

        const lending = await LendingModel.findById(id);
        if (!lending) {
            throw new APIError(404, 'Lending record not found');
        }
        if (lending.isReturned) {
            throw new APIError(400, 'Book already returned');
        }

        lending.isReturned = true;
        lending.returnedDate = new Date();
        await lending.save();

        res.json({ message: 'Book returned successfully', lending });
    } catch (error) {
        throw error;
    }
};

// Get lending history (by reader or book)
export const getLendingHistory = async (req: Request, res: Response) => {
    try {
        const { readerId, bookId } = req.query;

        // Validate query parameters
        if (readerId && !mongoose.isValidObjectId(readerId)) {
            throw new APIError(400, 'Invalid reader ID');
        }
        if (bookId && !mongoose.isValidObjectId(bookId)) {
            throw new APIError(400, 'Invalid book ID');
        }

        let query: any = {};
        if (readerId) query.readerId = readerId;
        if (bookId) query.bookId = bookId;

        const lendings = await LendingModel.find(query)
            .populate('readerId', 'name email')
            .populate('bookId', 'title author');
        res.json(lendings);
    } catch (error) {
        throw error;
    }
};

// Get overdue books
export const getOverdueBooks = async (req: Request, res: Response) => {
    try {
        const overdueLendings = await LendingModel.find({
            isReturned: false,
            dueDate: { $lt: new Date() },
        })
            .populate('readerId', 'name email')
            .populate('bookId', 'title author');

        res.json(overdueLendings);
    } catch (error) {
        throw error;
    }
};