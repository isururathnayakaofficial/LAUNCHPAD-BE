import path from "path";
import dotenv from "dotenv";


// load env FIRST
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

import express, { Application } from "express";
import customerRoutes from "./routes/customer.routes";
import privateTodosRoutes from "./routes/privateTodos.routers";
import startupProfileRouter from "./routes/startupProfile.router";
import tasksRouter from "./routes/task.routers";
import authRoutes from "./routes/auth.routes";
import cors from "cors";


const app: Application = express();


const allowedOrigins = [
  "http://localhost:5173",
  "https://launchpadpro-three.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.use("/api/customers", customerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/private-todos", privateTodosRoutes);
app.use("/api/tasks", tasksRouter);
app.use("/api/profile", startupProfileRouter); 

export default app;