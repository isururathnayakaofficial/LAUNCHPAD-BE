import {Router} from "express";

import {authMiddleware} from "../middleware/auth.middleware";
import {checkTaskOwnership} from "../middleware/tasks.middleware";
import {createTask, getSpecificTasks,deleteTask,updateTask} from "../controllers/tasks.controller";

const router = Router();
router.post("/create", authMiddleware, createTask); // task creator route
router.put("/update/:id", authMiddleware,checkTaskOwnership, updateTask);
router.delete("/delete/:id", authMiddleware,checkTaskOwnership, deleteTask);
router.get("/get/:userId", authMiddleware, getSpecificTasks);
export default router;