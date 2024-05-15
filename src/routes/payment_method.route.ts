import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../error_handler";
import {
  creatPaymentMethod,
  deletePaymentMethod,
  listPaymentMethod,
  updatePaymentMethod,
} from "../controllers/payment_method.controller";
import adminMiddleware from "../middlewares/admin";

const paymentMethodRoutes: Router = Router();

paymentMethodRoutes.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(creatPaymentMethod)
);
paymentMethodRoutes.get("/", [authMiddleware], errorHandler(listPaymentMethod));
paymentMethodRoutes.put(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updatePaymentMethod)
);
paymentMethodRoutes.delete(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deletePaymentMethod)
);

export default paymentMethodRoutes;
