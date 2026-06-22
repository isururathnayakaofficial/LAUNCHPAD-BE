"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const tasks_middleware_1 = require("../middleware/tasks.middleware");
const tasks_controller_1 = require("../controllers/tasks.controller");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
router.post("/create", auth_middleware_1.authMiddleware, upload_middleware_1.upload.array("files", 10), tasks_controller_1.createTask); // task creator route
router.put("/update/:id", auth_middleware_1.authMiddleware, tasks_middleware_1.checkTaskOwnership, tasks_controller_1.updateTask);
router.delete("/delete/:id", auth_middleware_1.authMiddleware, tasks_middleware_1.checkTaskOwnership, tasks_controller_1.deleteTask);
router.get("/get/:userId", auth_middleware_1.authMiddleware, tasks_controller_1.getSpecificTasks);
router.get("/get-task/:taskId", tasks_controller_1.getTaskByTaskID);
exports.default = router;
