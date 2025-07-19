import { Router } from "express"
import {getAllUsers, login, signup} from "../controllers/AuthController";
import {authenticateToken} from "../middlewares/authenticateToken";

const authRouter = Router()


authRouter.post("/signup", signup)
authRouter.get("/users", getAllUsers)
authRouter.get("/users", authenticateToken)
authRouter.post("/login", login)


export default authRouter
