import {NextFunction} from "express";
import mongoose from "mongoose";
import {Request, Response} from "express";
import {APIError} from "../error/APIError";

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof mongoose.Error) {
        res.status(400).json({message: error.message})
        return
    }

    if (error instanceof APIError) {
        res.status(500).json({message: error.message})
    }
    res.status(500).json({message: "Internal Server Error"})
}