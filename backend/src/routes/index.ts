import {Router} from "express";
import authRouter from "./auth.routes";
import bookRouter from "./book.routes";
import readerRouter from "./reader.routes";

const rootRouter = Router()

rootRouter.use("/auth", authRouter)
rootRouter.use("/book", bookRouter)
rootRouter.use("/reader", readerRouter)

export default rootRouter;