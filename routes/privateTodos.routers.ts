import { Router } from "express";
import{ createPrivateTodo, deleteTodo, updatePrivateTodo } from "../controllers/privateTodos.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { checkTodoOwnership } from "../middleware/privateTodos.middleware";
const router = Router();

//router.get("/getAll", getPrivateTodos);
router.post("/save", authMiddleware, createPrivateTodo);
router.put("/update/:id", authMiddleware,checkTodoOwnership, updatePrivateTodo);
router.delete("/delete/:id", authMiddleware,checkTodoOwnership, deleteTodo);
export default router;