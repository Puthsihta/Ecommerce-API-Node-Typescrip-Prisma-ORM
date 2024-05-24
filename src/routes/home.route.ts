import { Router } from "express";
import { errorHandler } from "../error_handler";
import { home, homePrefeeds, preload } from "../controllers/home.controller";

const homeRoute: Router = Router();

homeRoute.get("/", errorHandler(home));
homeRoute.get("/preload", errorHandler(preload));
homeRoute.get("/home-prefeeds", errorHandler(homePrefeeds));

export default homeRoute;
