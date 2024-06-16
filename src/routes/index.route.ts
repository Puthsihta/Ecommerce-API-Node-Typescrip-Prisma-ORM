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

rootRouter.use("/v1/auth", authRoute);
rootRouter.use("/v1/products", productRoutes);
rootRouter.use("/v1/address", addressRoutes);
rootRouter.use("/v1/order", orderRoute);
rootRouter.use("/v1/admin", adminRoute);
rootRouter.use("/v1/category", categoryRout);
rootRouter.use("/v1/payment-method", paymentMethodRoutes);
rootRouter.use("/v1/shops", shopRoutes);
rootRouter.use("/v1/setting", settingRoute);
rootRouter.use("/v1/home", homeRoute);
rootRouter.use("/v1/upload", uploadRouter);

export default rootRouter;
