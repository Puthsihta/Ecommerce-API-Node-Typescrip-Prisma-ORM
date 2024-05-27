import { Router } from "express";
import { errorHandler } from "../error_handler";
import authMiddleware from "../middlewares/auth";
import {
  createOrder,
  listOder,
  listOrderById,
  cancelStatus,
  orderReview,
} from "../controllers/order.controller";

const orderRoute: Router = Router();

orderRoute.post("/", [authMiddleware], errorHandler(createOrder));
orderRoute.get("/", [authMiddleware], errorHandler(listOder));
orderRoute.post("/review-order", [authMiddleware], errorHandler(orderReview));
orderRoute.put("/cancel/:id", [authMiddleware], errorHandler(cancelStatus));
orderRoute.get("/:id", [authMiddleware], errorHandler(listOrderById));

export default orderRoute;
