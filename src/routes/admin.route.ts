import { Router } from "express";
import { errorHandler } from "../error_handler";
import authMiddleware from "../middlewares/auth";
import {
  changePassword,
  changeUserRole,
  createBanner,
  createProvice,
  deleteBanner,
  deleteProvice,
  getUserByID,
  listBanner,
  listProvices,
  listUser,
  updateBanner,
  updateBestSalling,
  updatedFeatureShop,
  updateProvice,
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
adminRoute.get("/banner", errorHandler(listBanner));
adminRoute.post(
  "/banner",
  [authMiddleware, adminMiddleware],
  errorHandler(createBanner)
);
adminRoute.put(
  "/banner/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateBanner)
);
adminRoute.delete(
  "/banner/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteBanner)
);
adminRoute.get("/provices", errorHandler(listProvices));
adminRoute.post(
  "/provices",
  [authMiddleware, adminMiddleware],
  errorHandler(createProvice)
);
adminRoute.put(
  "/provices/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateProvice)
);
adminRoute.delete(
  "/provices/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteProvice)
);
adminRoute.post(
  "/best-salling/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateBestSalling)
);
adminRoute.post(
  "/feature-shop/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updatedFeatureShop)
);

export default adminRoute;
