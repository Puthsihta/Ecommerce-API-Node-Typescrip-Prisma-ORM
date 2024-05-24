import { Router } from "express";
import { errorHandler } from "../error_handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import {
  closeShop,
  creatShop,
  deleteShop,
  favoriteShop,
  listShop,
  listShopByID,
  updateShop,
} from "../controllers/shop.controller";

const shopRoutes: Router = Router();

shopRoutes.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(creatShop)
);
shopRoutes.get("/", errorHandler(listShop));
shopRoutes.get("/:id", errorHandler(listShopByID));
shopRoutes.put(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateShop)
);
shopRoutes.put(
  "/close/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(closeShop)
);
shopRoutes.delete(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteShop)
);
shopRoutes.post("/favorite/:id", [authMiddleware], errorHandler(favoriteShop));

export default shopRoutes;
