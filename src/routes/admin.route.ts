import { Router } from "express";
import { errorHandler } from "../error_handler";
import authMiddleware from "../middlewares/auth";
import {
  changePassword,
  changeUserRole,
  getUserByID,
  listUser,
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
adminRoute.put(
  "/change-password",
  [authMiddleware, adminMiddleware],
  errorHandler(changePassword)
);

export default adminRoute;
