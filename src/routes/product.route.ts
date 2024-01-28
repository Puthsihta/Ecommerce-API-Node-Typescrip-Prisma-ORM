import { Router } from "express";
import { errorHandler } from "../error_handler";
import {
  createProduct,
  deleteProduct,
  listProduct,
  listProductByID,
  updateProduct,
} from "../controllers/product.controller";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";

const productRoutes: Router = Router();

productRoutes.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(createProduct)
);
productRoutes.get("/", errorHandler(listProduct));
productRoutes.get("/:id", errorHandler(listProductByID));
productRoutes.put(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateProduct)
);
productRoutes.delete(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteProduct)
);

export default productRoutes;
