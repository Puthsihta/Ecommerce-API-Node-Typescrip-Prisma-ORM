import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const PORT = process.env.APP_PORT;
const JWT_SECRET = process.env.JWT_SECRET!;

export { PORT, JWT_SECRET };
