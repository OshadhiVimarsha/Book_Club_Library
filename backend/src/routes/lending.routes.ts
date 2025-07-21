import { Router } from "express";
import {
    getLendingHistory,
    getOverdueBooks,
    lendBook,
    notifyOverdueBooks,
    returnBook
} from "../controllers/LendingController";

const lendingRouter = Router()

lendingRouter.post('/lend', lendBook);
lendingRouter.post('/return/:id', returnBook);
lendingRouter.get('/history', getLendingHistory);
lendingRouter.get('/overdue', getOverdueBooks);
lendingRouter.post('/notify-overdue', notifyOverdueBooks);

export  default lendingRouter;