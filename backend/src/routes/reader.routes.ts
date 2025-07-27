import { Router } from "express";

import {deleteReader, getReader, getReaderById, saveReader, updateReader} from "../controllers/ReaderController";

const readerRouter = Router()

readerRouter.post("/", saveReader);
readerRouter.get("/", getReader);
readerRouter.get("/:id", getReaderById);
readerRouter.delete("/:id", deleteReader);
readerRouter.put("/:id", updateReader);

export  default readerRouter;