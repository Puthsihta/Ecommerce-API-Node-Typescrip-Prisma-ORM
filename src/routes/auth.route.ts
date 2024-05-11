import { Router } from "express";
import {
  loginUser,
  loginAdmin,
  profile,
  register,
  updateProfile,
} from "../controllers/auth.controller";
import { errorHandler } from "../error_handler";
import authMiddleware from "../middlewares/auth";

const authRoute: Router = Router();

authRoute.post("/register", errorHandler(register));
authRoute.post("/login-user", errorHandler(loginUser));
authRoute.post("/login-admin", errorHandler(loginAdmin));
authRoute.get("/profile", [authMiddleware], errorHandler(profile));
authRoute.put("/update-user", [authMiddleware], errorHandler(updateProfile));

export default authRoute;
