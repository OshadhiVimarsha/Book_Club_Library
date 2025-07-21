import { Router } from "express";
import {getLendingHistory, getOverdueBooks, lendBook, returnBook} from "../controllers/LendingController";

const lendingRouter = Router()

lendingRouter.post('/lend', lendBook);
lendingRouter.post('/return/:id', returnBook);
lendingRouter.get('/history', getLendingHistory);
lendingRouter.get('/overdue', getOverdueBooks);

export  default lendingRouter;