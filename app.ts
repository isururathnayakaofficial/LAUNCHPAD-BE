import path from "path";
import dotenv from "dotenv";

// load env FIRST
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

import express, { Application } from "express";
import customerRoutes from "./routes/customer.routes";
import privateTodosRoutes from "./routes/privateTodos.routers";
import tasksRouter from "./routes/task.routers";
import authRoutes from "./routes/auth.routes";

const app: Application = express();

app.use(express.json());

app.use("/api/customers", customerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/private-todos", privateTodosRoutes);
app.use("/api/tasks", tasksRouter);

export default app;