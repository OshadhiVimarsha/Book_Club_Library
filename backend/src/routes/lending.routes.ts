import { Router } from "express";
import {
    deleteLending,
    getAllLendings,
    getLendingHistory,
    getOverdueBooks,
    lendBook,
    notifyOverdueBooks,
    returnBook
} from "../controllers/LendingController";

const lendingRouter = Router()

lendingRouter.get("/", getAllLendings);
lendingRouter.post('/lend', lendBook);
lendingRouter.put('/return/:id', returnBook);
lendingRouter.get('/history', getLendingHistory);
lendingRouter.get('/overdue', getOverdueBooks);
lendingRouter.post('/notify-overdue', notifyOverdueBooks);
lendingRouter.delete('/:id', deleteLending);

export  default lendingRouter;