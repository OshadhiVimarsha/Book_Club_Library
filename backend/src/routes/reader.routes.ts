import { Router } from "express";

import {deleteReader, getReader, getReaderById, saveReader, updateReader} from "../controllers/ReaderController";

const readerRouter = Router()

readerRouter.post("/save", saveReader);
readerRouter.get("/get", getReader);
readerRouter.get("/:id", getReaderById);
readerRouter.delete("/:id", deleteReader);
readerRouter.put("/:id", updateReader);

export  default readerRouter;