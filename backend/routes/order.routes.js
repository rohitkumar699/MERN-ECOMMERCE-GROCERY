import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {
  getAllOrders,
  getUserOrders,
  placeOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";
const orderRouter = express.Router();
// USER
orderRouter.post("/place", isAuth, placeOrder);
orderRouter.get("/my-orders", isAuth, getUserOrders);
// ADMIN
orderRouter.get("/all", isAdmin, getAllOrders);
orderRouter.put("/status/:orderId", isAdmin, updateOrderStatus);

export default orderRouter;
