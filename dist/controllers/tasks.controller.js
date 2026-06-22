"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTask = exports.deleteTask = exports.getTaskByTaskID = exports.getSpecificTasks = exports.createTask = void 0;
const db_1 = require("../config/db");
const mongodb_1 = require("mongodb");
const mail_service_1 = require("../services/mail.service");
const tasks = () => (0, db_1.getDB)().collection("tasks");
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, email, role, description, name } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        if (!title || !email || !role || !description || !name) {
            return res.status(400).json({
                success: false,
                message: "Title, email, role, description and name are required"
            });
        }
        // 🔥 CLOUDINARY SAFE EXTRACTION
        const multipleFiles = req.files;
        const mediaUrls = (multipleFiles === null || multipleFiles === void 0 ? void 0 : multipleFiles.map(file => file.path || file.secure_url)) || [];
        const tasksToken = crypto.randomUUID();
        const result = yield (0, db_1.getDB)().collection("tasks").insertOne({
            title,
            name,
            email,
            role,
            description,
            mediaUrl: mediaUrls,
            inviteToken: tasksToken,
            status: "pending",
            createdAt: new Date(),
            userId
        });
        const savedTaskId = result.insertedId;
        const joinLink = `${process.env.FRONTEND_URL}/tasks/${savedTaskId}`;
        try {
            yield (0, mail_service_1.sendTaskEmail)(email, title, joinLink);
        }
        catch (emailError) {
            console.error("EMAIL ERROR:", emailError);
        }
        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: {
                id: result.insertedId,
                title,
                name,
                email,
                role,
                description,
                mediaUrl: mediaUrls,
                inviteToken: tasksToken,
                status: "pending",
                joinLink,
                createdAt: new Date()
            }
        });
    }
    catch (error) {
        console.error(" STRINGIFIED ERROR:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        console.log("REQ BODY:", req.body);
        console.log("REQ FILES:", req.files);
        return res.status(500).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || "Unknown error",
            fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
        });
    }
});
exports.createTask = createTask;
const getSpecificTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
        //  Get user from DB (IMPORTANT)
        const user = yield (0, db_1.getDB)()
            .collection("users")
            .findOne({ _id: new mongodb_1.ObjectId(userId) });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        //  Use email to fetch tasks
        const specificTasks = yield tasks()
            .find({ email: user.email })
            .toArray();
        return res.status(200).json({
            success: true,
            message: "Tasks fetched successfully",
            data: specificTasks
        });
    }
    catch (error) {
        console.error("Error fetching specific tasks:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.getSpecificTasks = getSpecificTasks;
const getTaskByTaskID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.taskId;
        if (!mongodb_1.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID"
            });
        }
        const task = yield tasks().findOne({
            _id: new mongodb_1.ObjectId(taskId)
        });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Task fetched successfully",
            data: {
                title: task.title,
                description: task.description
            }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.getTaskByTaskID = getTaskByTaskID;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.id;
        //const userId = req.userId;
        const result = yield tasks().deleteOne({
            _id: new mongodb_1.ObjectId(taskId),
            // email: userId //  ensures only owner can delete
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found or unauthorized"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });
    }
    catch (error) {
        console.error("Error deleting task:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.deleteTask = deleteTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.id;
        const { title, description, role, status } = req.body;
        const updateData = {};
        if (title)
            updateData.title = title;
        if (description)
            updateData.description = description;
        if (role)
            updateData.role = role;
        if (status)
            updateData.status = status;
        const result = yield tasks().updateOne({ _id: new mongodb_1.ObjectId(taskId) }, {
            $set: updateData
        });
        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Task updated successfully"
        });
    }
    catch (error) {
        console.error("Error updating task:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.updateTask = updateTask;
