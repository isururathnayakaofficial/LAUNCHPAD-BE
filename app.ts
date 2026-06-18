import express, { Application } from "express";
import customerRoutes from "./routes/customer.routes";
import privateTodosRoutes from "./routes/privateTodos.routers";
import tasksRouter from "./routes/task.routers";
import authRoutes from "./routes/auth.routes";
import dotenv from "dotenv";
import path from "path";
const app: Application = express();

app.use(express.json());
dotenv.config({
    path: path.resolve(process.cwd(), ".env")
});  

app.use("/api/customers", customerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/private-todos", privateTodosRoutes);
app.use("/api/tasks", tasksRouter);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);


export default app;