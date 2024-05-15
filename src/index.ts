import express, { Express } from "express";
import { PORT } from "./secret";
import rootRouter from "./routes/index.route";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/error";

const app: Express = express();

app.use(express.json());
app.use("/api", rootRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("http://localhost:", PORT);
});

export const prismaClient = new PrismaClient();
