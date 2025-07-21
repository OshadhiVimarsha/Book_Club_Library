import {ReaderModel} from "../models/Reader";
import { APIError } from "../error/APIError";
import { NextFunction, Request, Response } from "express";

// Save Reader
export const saveReader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reader = new ReaderModel(req.body);
        await reader.save()
        res.status(201).json(reader)
    } catch (error:any) {
        // error handler
        next(error)
    }
}

// Get All Reader
export const getReader = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const reader = await ReaderModel.find()
        res.status(200).json(reader)
    } catch (error:any) {
        next(error)
    }
}

// Get Reader by id
export const getReaderById  = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const reader = await ReaderModel.findById(req.params.id)
        console.log("reader", reader)
        if (!reader) {
            throw new APIError(404, "Reader not found")
        }
        res.status(200).json(reader)
    } catch (error:any) {
        next(error)
    }
}

// delete Reader
export const deleteReader = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const deleteReader = await ReaderModel.findByIdAndDelete(req.params.id)
        if (!deleteReader) {
            throw new APIError(404, "Reader not found")
        }
        res.status(200).json({message: `Reader has been deleted`})
    } catch (error:any) {
        next(error)
    }
}

// update customer
export const updateReader = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const updateReader = await ReaderModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            // If true -> return the update customer
            // If false -> return the old customer
            runValidators: true,
        })
        if (!updateReader) {
            throw new APIError(404, "Reader not found")
        }
        res.status(200).json({message: `Reader has been updated`})
    } catch (error:any) {
        next(error)
    }
}