import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/get", getAnalytics);

export default analyticsRouter;