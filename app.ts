import express, { Application } from "express";
import customerRoutes from "./routes/customer.routes";

const app: Application = express();

app.use(express.json());

app.use("/api/customers", customerRoutes);

export default app;