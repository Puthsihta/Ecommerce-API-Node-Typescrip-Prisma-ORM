import { Router } from "express";
import { errorHandler } from "../error_handler";
import authMiddleware from "../middlewares/auth";
import {
  addCart,
  changeQty,
  deleteCart,
  listCart,
} from "../controllers/cart.controller";

const cartRoute: Router = Router();

cartRoute.post("/", [authMiddleware], errorHandler(addCart));
cartRoute.delete("/:id", [authMiddleware], errorHandler(deleteCart));
cartRoute.put("/:id", [authMiddleware], errorHandler(changeQty));
cartRoute.get("/", [authMiddleware], errorHandler(listCart));

export default cartRoute;
