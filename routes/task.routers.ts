import {Router} from "express";

import {authMiddleware} from "../middleware/auth.middleware";
import {checkTaskOwnership} from "../middleware/tasks.middleware";
import {createTask, getSpecificTasks,deleteTask,updateTask, getTaskByTaskID} from "../controllers/tasks.controller";
import { upload } from "../middleware/upload.middleware";

const router = Router();
router.post("/create", authMiddleware, upload.array("files", 10), createTask); // task creator route
router.put("/update/:id", authMiddleware,checkTaskOwnership, updateTask);
router.delete("/delete/:id", authMiddleware,checkTaskOwnership, deleteTask);
router.get("/get/:userId", authMiddleware, getSpecificTasks);
router.get("/get-task/:taskId",  getTaskByTaskID);
export default router;