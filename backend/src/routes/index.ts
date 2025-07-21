import {Router} from "express";
import authRouter from "./auth.routes";
import bookRouter from "./book.routes";
import readerRouter from "./reader.routes";
import lendingRoutes from "./lending.routes";

const rootRouter = Router()

rootRouter.use("/auth", authRouter)
rootRouter.use("/book", bookRouter)
rootRouter.use("/reader", readerRouter)
rootRouter.use("/lending", lendingRoutes)

export default rootRouter;