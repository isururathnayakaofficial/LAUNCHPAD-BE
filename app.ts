import express, { Application } from "express";
import customerRoutes from "./routes/customer.routes";
import authRoutes from "./routes/auth.routes";
const app: Application = express();

app.use(express.json());

app.use("/api/customers", customerRoutes);
app.use("/api/auth", authRoutes);

export default app;