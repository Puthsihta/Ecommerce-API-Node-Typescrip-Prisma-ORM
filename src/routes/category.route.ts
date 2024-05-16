import { Router } from "express";
import { errorHandler } from "../error_handler";
import authMiddleware from "../middlewares/auth";
import {
  creatCategory,
  creatSubCategory,
  deleteCategory,
  deleteSubCategory,
  listCategory,
  listSubCategory,
  updateCategory,
  updateSubCategory,
} from "../controllers/category.controller";
import adminMiddleware from "../middlewares/admin";

const categoryRout: Router = Router();

categoryRout.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(creatCategory)
);
categoryRout.get("/", [authMiddleware], errorHandler(listCategory));
categoryRout.put(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateCategory)
);
categoryRout.delete(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteCategory)
);

categoryRout.post(
  "/sub-category",
  [authMiddleware, adminMiddleware],
  errorHandler(creatSubCategory)
);
categoryRout.get(
  "/sub-category",
  [authMiddleware],
  errorHandler(listSubCategory)
);
categoryRout.put(
  "/sub-category/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateSubCategory)
);
categoryRout.delete(
  "/sub-category/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteSubCategory)
);

export default categoryRout;
