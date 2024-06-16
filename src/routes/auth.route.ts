import { Router } from "express";
import {
  loginAdmin,
  profile,
  register,
  updateProfile,
  sentSms,
  verifyOtp,
} from "../controllers/auth.controller";
import { errorHandler } from "../error_handler";
import authMiddleware from "../middlewares/auth";

const authRoute: Router = Router();

authRoute.post("/register", errorHandler(register));
authRoute.post("/login-admin", errorHandler(loginAdmin));
authRoute.get("/profile", [authMiddleware], errorHandler(profile));
authRoute.put("/update-user", [authMiddleware], errorHandler(updateProfile));
authRoute.post("/send-sms", errorHandler(sentSms));
authRoute.post("/verify-sms", errorHandler(verifyOtp));

export default authRoute;
