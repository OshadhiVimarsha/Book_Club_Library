import { Router } from "express";
import {getDashboardSummary} from "../controllers/DashboardController";

const dashboardRouter = Router()

dashboardRouter.get("/summary", getDashboardSummary);

export  default dashboardRouter;