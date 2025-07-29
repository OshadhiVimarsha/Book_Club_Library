import {NextFunction, Request, Response} from 'express';
import { LendingModel } from '../models/Lending';
import { BookModel } from '../models/Book';
import { ReaderModel } from '../models/Reader';
import { addDays } from 'date-fns';
import { APIError } from '../error/APIError';
import mongoose from "mongoose";
import {sendOverdueEmail} from "../util/email";
import {generateLendingId} from "../util/generateLendingId";

// Get all lending records
export const getAllLendings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lendings = await LendingModel.find().populate('readerId').populate('bookId');
        res.status(200).json(lendings);
    } catch (error: any) {
        next(error);
    }
};

// Lend a book to a reader
export const lendBook = async (req: Request, res: Response, next: NextFunction) => {
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
            dueDate: addDays(new Date(), 1), // Due in 1 day
            isReturned: false,
        });

        await lending.save();
        res.status(201).json({ message: 'Book lent successfully', lending });
    } catch (error) {
        next(error);
    }
};

// Return a book
export const returnBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        console.log("Received return request for ID:", id);

        if (!mongoose.isValidObjectId(id)) {
            console.log("Invalid ObjectId:", id);
            throw new APIError(400, 'Invalid lending ID');
        }

        const lending = await LendingModel.findById(id);
        if (!lending) {
            console.log("Lending not found for ID:", id);
            throw new APIError(404, 'Lending record not found');
        }

        console.log("Lending found:", lending);

        if (lending.isReturned) {
            console.log("Already returned lending:", lending._id);
            throw new APIError(400, 'Book already returned');
        }

        lending.isReturned = true;
        lending.returnedDate = new Date();
        await lending.save();

        res.json({ message: 'Book returned successfully', lending });
    } catch (error) {
        next(error);
    }
};


// Get lending history
export const getLendingHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { readerId, bookId } = req.query;

        if (readerId && !mongoose.isValidObjectId(readerId)) {
            throw new APIError(400, 'Invalid reader ID');
        }
        if (bookId && !mongoose.isValidObjectId(bookId)) {
            throw new APIError(400, 'Invalid book ID');
        }

        const query: any = {};
        if (readerId) query.readerId = readerId;
        if (bookId) query.bookId = bookId;

        const lendings = await LendingModel.find(query)
            .populate('readerId', 'name email')
            .populate('bookId', 'title author');
        res.json(lendings);
    } catch (error) {
        next(error);
    }
};

// Get overdue books
export const getOverdueBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const overdueLendings = await LendingModel.find({
            isReturned: false,
            dueDate: { $lt: new Date() },
        })
            .populate('readerId', 'name email')
            .populate('bookId', 'title author');

        res.json(overdueLendings);
    } catch (error) {
        next(error);
    }
};

// Notify readers about overdue books
export const notifyOverdueBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const overdueLendings = await LendingModel.find({
            isReturned: false,
            dueDate: { $lt: new Date() },
        })
            .populate({
                path: 'readerId',
                select: 'name email',
                match: { name: { $exists: true, $ne: '' }, email: { $exists: true, $ne: '' } },
            })
            .populate('bookId', 'title author');

        if (overdueLendings.length === 0) {
            return res.json({ message: 'No overdue books found' });
        }

        const readerLendings: { [key: string]: { reader: { name: string; email: string }; lendings: any[] } } = {};
        for (const lending of overdueLendings) {
            if (!lending.readerId || !('name' in lending.readerId) || !('email' in lending.readerId)) {
                console.warn(`Skipping lending record ${lending._id}: Invalid or missing reader data`);
                continue;
            }
            if (!lending.bookId || !('title' in lending.bookId) || !('author' in lending.bookId)) {
                console.warn(`Skipping lending record ${lending._id}: Invalid or missing book data`);
                continue;
            }

            const reader = lending.readerId as { _id: mongoose.Types.ObjectId; name: string; email: string };
            const readerId = reader._id.toString();

            if (!readerLendings[readerId]) {
                readerLendings[readerId] = {
                    reader: {
                        name: reader.name || 'Unknown',
                        email: reader.email || 'no-email@example.com',
                    },
                    lendings: [],
                };
            }
            readerLendings[readerId].lendings.push(lending);
        }

        if (Object.keys(readerLendings).length === 0) {
            return res.json({ message: 'No valid readers found for overdue notifications' });
        }

        const emailResults = [];
        for (const readerId in readerLendings) {
            const { reader, lendings } = readerLendings[readerId];
            try {
                const result = await sendOverdueEmail(reader, lendings);
                emailResults.push(result);
            } catch (emailError) {
                console.error(`Failed to send email to ${reader.email}:`, emailError);
                emailResults.push({ success: false, message: `Failed to send email to ${reader.email}` });
            }
        }

        res.json({ message: 'Notifications processed', results: emailResults });
    } catch (error) {
        console.error('Error in notifyOverdueBooks:', error);
        next(new APIError(500, 'Failed to process overdue notifications'));
    }
};

export const createLending = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lendingId = await generateLendingId();

        const lending = new LendingModel({
            lendingId,
            bookId: req.body.bookId,
            readerId: req.body.readerId,
            borrowedDate: new Date(),
            dueDate: req.body.dueDate,
            isReturned: false,
        });

        await lending.save();

        res.status(201).json(lending);
    } catch (err) {
        next(err);
    }
};

// Delete a lending record
export const deleteLending = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            throw new APIError(400, 'Invalid lending ID');
        }

        const lending = await LendingModel.findByIdAndDelete(id);
        if (!lending) {
            throw new APIError(404, 'Lending record not found');
        }

        res.status(200).json({ message: 'Lending record deleted successfully' });
    } catch (error) {
        next(error);
    }
};
