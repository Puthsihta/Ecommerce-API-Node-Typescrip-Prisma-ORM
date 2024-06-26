import { Router } from "express";
import { errorHandler } from "../error_handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import {
  addShopPromotion,
  cancelPromotion,
  closeShop,
  creatShop,
  deleteShop,
  favoriteShop,
  listFavoritesShop,
  listProductbyShop,
  listShop,
  listShopByID,
  promotionShop,
  updateShop,
} from "../controllers/shop.controller";

const shopRoutes: Router = Router();

shopRoutes.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(creatShop)
);
shopRoutes.get("/", errorHandler(listShop));
shopRoutes.get("/promotion-shops", errorHandler(promotionShop));
shopRoutes.get("/favorites", [authMiddleware], errorHandler(listFavoritesShop));
shopRoutes.get("/product_list", errorHandler(listProductbyShop));
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
shopRoutes.post(
  "/add-promotion/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(addShopPromotion)
);
shopRoutes.put(
  "/cancel-promotion/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(cancelPromotion)
);

export default shopRoutes;
