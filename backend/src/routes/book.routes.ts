import { Router } from "express";
import {authenticateToken} from "../middlewares/authenticateToken";
import {
    deleteBook,
    getBookById,
    getBooks,
    saveBook,
    updateBook
} from "../controllers/BookController";

const bookRouter = Router()

bookRouter.post("/save", saveBook);
bookRouter.get("/get", getBooks);
bookRouter.get("/:id", getBookById);
bookRouter.delete("/:id", deleteBook);
bookRouter.put("/:id", updateBook);

export  default bookRouter;