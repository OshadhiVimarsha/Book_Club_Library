import {Router} from "express";
import authRouter from "./auth.routes";
import bookRouter from "./book.routes";

const rootRouter = Router()

rootRouter.use("/auth", authRouter)
rootRouter.use("/book", bookRouter)

export default rootRouter;