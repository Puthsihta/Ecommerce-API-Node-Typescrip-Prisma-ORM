import { Router } from "express";
import authRoute from "./auth.route";
import productRoutes from "./product.route";
import addressRoutes from "./address.route";
import cartRoute from "./cart.route";
import orderRoute from "./order.route";
import adminRoute from "./admin.route";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoute);
rootRouter.use("/products", productRoutes);
rootRouter.use("/address", addressRoutes);
rootRouter.use("/cart", cartRoute);
rootRouter.use("/order", orderRoute);
rootRouter.use("/admin", adminRoute);

export default rootRouter;
