import { Router } from "express";
import authRoute from "./auth.route";
import productRoutes from "./product.route";
import addressRoutes from "./address.route";
import orderRoute from "./order.route";
import adminRoute from "./admin.route";
import { uploadRouter } from "./upload.route";
import paymentMethodRoutes from "./payment_method.route";
import categoryRout from "./category.route";
import shopRoutes from "./shop.route";
import settingRoute from "./setting.route";
import homeRoute from "./home.route";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoute);
rootRouter.use("/products", productRoutes);
rootRouter.use("/address", addressRoutes);
rootRouter.use("/order", orderRoute);
rootRouter.use("/admin", adminRoute);
rootRouter.use("/category", categoryRout);
rootRouter.use("/payment-method", paymentMethodRoutes);
rootRouter.use("/shops", shopRoutes);
rootRouter.use("/setting", settingRoute);
rootRouter.use("/home", homeRoute);
rootRouter.use("/upload", uploadRouter);

export default rootRouter;
