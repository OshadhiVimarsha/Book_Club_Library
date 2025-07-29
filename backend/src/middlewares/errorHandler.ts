import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { APIError } from "../error/APIError";

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        return next(error); // Prevent duplicate send
    }

    if (error instanceof mongoose.Error) {
        return res.status(400).json({ message: error.message });
    }

    if (error instanceof APIError) {
        return res.status(error.status || 500).json({ message: error.message });
    }

    console.error("Unhandled Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
};
