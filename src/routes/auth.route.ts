import { Router } from "express";
import {
  login,
  profile,
  register,
  updateProfile,
} from "../controllers/auth.controller";
import { errorHandler } from "../error_handler";
import authMiddleware from "../middlewares/auth";

const authRoute: Router = Router();

authRoute.post("/register", errorHandler(register));
authRoute.post("/login", errorHandler(login));
authRoute.get("/profile", [authMiddleware], errorHandler(profile));
authRoute.put("/update-user", [authMiddleware], errorHandler(updateProfile));

export default authRoute;
