import { Router } from "express";
import { errorHandler } from "../error_handler";
import authMiddleware from "../middlewares/auth";
import {
  createOrder,
  listOder,
  listOrderById,
  cancelStatus,
  orderReview,
  listOrders,
  updateOrderStatus,
} from "../controllers/order.controller";
import adminMiddleware from "../middlewares/admin";

const orderRoute: Router = Router();

orderRoute.post("/", [authMiddleware], errorHandler(createOrder));
orderRoute.get("/", [authMiddleware], errorHandler(listOder));
orderRoute.get(
  "/list-all-orders",
  [authMiddleware, adminMiddleware],
  errorHandler(listOrders)
);
orderRoute.put(
  "/update-order-status/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateOrderStatus)
);
orderRoute.post("/review-order", [authMiddleware], errorHandler(orderReview));
orderRoute.put("/cancel/:id", [authMiddleware], errorHandler(cancelStatus));
orderRoute.get("/:id", [authMiddleware], errorHandler(listOrderById));

export default orderRoute;
