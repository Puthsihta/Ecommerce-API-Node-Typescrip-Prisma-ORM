import { Router } from "express";
import { errorHandler } from "../error_handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import {
  creatSetting,
  setting,
  updateSetting,
} from "../controllers/setting.controller";

const settingRoute: Router = Router();

settingRoute.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(creatSetting)
);
settingRoute.get("/", errorHandler(setting));
settingRoute.put(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateSetting)
);

export default settingRoute;
