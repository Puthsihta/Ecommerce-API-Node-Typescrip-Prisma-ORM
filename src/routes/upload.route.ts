import { Router } from "express";

import { uploadFile } from "../controllers/upload.controller";
import { errorHandler } from "../error_handler";
import uploadMiddleware from "../middlewares/upload";

const uploadRouter: Router = Router();

uploadRouter.post("/image", [uploadMiddleware], errorHandler(uploadFile));

export { uploadRouter };
