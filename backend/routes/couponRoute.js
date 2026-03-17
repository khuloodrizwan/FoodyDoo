import express from "express";
import { createCoupon, listCoupons, deleteCoupon, applyCoupon } from "../controllers/couponController.js";

const couponRouter = express.Router();

couponRouter.post("/create", createCoupon);
couponRouter.get("/list", listCoupons);
couponRouter.post("/delete", deleteCoupon);
couponRouter.post("/apply", applyCoupon);

export default couponRouter;