import { Router } from "express";
import { errorHandler } from "../error_handler";
import authMiddleware from "../middlewares/auth";
import {
  createAddress,
  deleteAddress,
  listAddress,
  updateAddress,
} from "../controllers/address.controller";

const addressRoutes: Router = Router();

addressRoutes.post("/", [authMiddleware], errorHandler(createAddress));
addressRoutes.get("/", [authMiddleware], errorHandler(listAddress));
addressRoutes.delete("/:id", [authMiddleware], errorHandler(deleteAddress));
addressRoutes.put("/:id", [authMiddleware], errorHandler(updateAddress));

export default addressRoutes;
