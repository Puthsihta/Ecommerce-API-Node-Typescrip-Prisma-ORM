import { Router } from "express";
import { errorHandler } from "../error_handler";
import authMiddleware from "../middlewares/auth";
import {
  changeUserRole,
  getUserByID,
  listOrders,
  listUser,
  updateOrderStatus,
} from "../controllers/admin.controller";
import adminMiddleware from "../middlewares/admin";

const adminRoute: Router = Router();

adminRoute.get(
  "/list-users",
  [authMiddleware, adminMiddleware],
  errorHandler(listUser)
);
adminRoute.get(
  "/list-users/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(getUserByID)
);
adminRoute.put(
  "/change-user-role/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(changeUserRole)
);
adminRoute.put(
  "/change-user-role/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(changeUserRole)
);
adminRoute.get(
  "/list-all-orders",
  [authMiddleware, adminMiddleware],
  errorHandler(listOrders)
);
adminRoute.put(
  "/update-order-status/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateOrderStatus)
);

export default adminRoute;
