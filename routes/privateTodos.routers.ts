import { Router } from "express";
import{ createPrivateTodo } from "../controllers/privateTodos.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const router = Router();

//router.get("/getAll", getPrivateTodos);
router.post("/save", authMiddleware, createPrivateTodo);

export default router;