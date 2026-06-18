import {Router} from "express";

import {authMiddleware} from "../middleware/auth.middleware";
import {checkTaskOwnership} from "../middleware/tasks.middleware";
import {createTask} from "../controllers/tasks.controller";

const router = Router();
router.post("/create", authMiddleware,checkTaskOwnership, createTask);
//router.put("/update/:id", authMiddleware,checkTaskOwnership, updateTask);
//router.delete("/delete/:id", authMiddleware,checkTaskOwnership, deleteTask);
//router.get("/get/:userId", authMiddleware, getTasks);
export default router;