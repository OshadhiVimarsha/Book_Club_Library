import express, { Request, Response } from "express";
import dotenv from "dotenv";
import {connectDB} from "./db/mongo";
import rootRouter from "./routes";
import {errorHandler} from "./middlewares/errorHandler";
import cors from "cors";

dotenv.config()
const app = express()

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeader: ["Content-Type", "Authorization"]
}

app.use(cors(corsOptions));

app.use(express.json())

const PORT = process.env.PORT;

app.use("/api", rootRouter)
app.use(errorHandler)


app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Connected to DB, http://localhost:${PORT}`);
    });
})



