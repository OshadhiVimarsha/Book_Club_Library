import { Request, Response, NextFunction } from "express";
import { BookModel } from "../models/Book";
import { ReaderModel } from "../models/Reader";
import { LendingModel } from "../models/Lending";

export const getDashboardSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [books, readers, lendings] = await Promise.all([
            BookModel.countDocuments(),
            ReaderModel.countDocuments(),
            LendingModel.countDocuments(),
        ]);

        res.json({
            totalBooks: books,
            totalReaders: readers,
            totalLendings: lendings,
        });
    } catch (err) {
        next(err);
    }
};
