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
exports.getPrivateTodos = exports.deleteTodo = exports.updatePrivateTodo = exports.createPrivateTodo = void 0;
const db_1 = require("../config/db");
const mongodb_1 = require("mongodb");
const privateTodosCollection = () => (0, db_1.getDB)().collection("privateTodos");
const createPrivateTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, status } = req.body;
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }
        if (!title) {
            res.status(400).json({
                success: false,
                message: "Title is required"
            });
            return;
        }
        const result = yield privateTodosCollection().insertOne({
            title,
            description,
            status: status || "pending",
            userId: new mongodb_1.ObjectId(userId),
            createdAt: new Date(),
            updatedAt: new Date()
        });
        res.status(201).json({
            success: true,
            message: "Todo created successfully",
            data: {
                id: result.insertedId,
                title,
                description,
                status: "pending"
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.createPrivateTodo = createPrivateTodo;
const updatePrivateTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, status } = req.body;
        const todoId = req.params.id;
        const userId = req.userId;
        // Auth check
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }
        //  Validate todoId
        if (!mongodb_1.ObjectId.isValid(todoId)) {
            res.status(400).json({
                success: false,
                message: "Invalid todo id"
            });
            return;
        }
        //  At least one field required
        if (!title && !description && !status) {
            res.status(400).json({
                success: false,
                message: "At least one field (title, description, status) is required to update"
            });
            return;
        }
        const collection = privateTodosCollection();
        // Single optimized update query
        const result = yield collection.updateOne({
            _id: new mongodb_1.ObjectId(todoId),
            userId: new mongodb_1.ObjectId(userId)
        }, {
            $set: Object.assign(Object.assign(Object.assign(Object.assign({}, (title && { title })), (description && { description })), (status && { status })), { updatedAt: new Date() })
        });
        //  Handle not found
        if (result.matchedCount === 0) {
            res.status(404).json({
                success: false,
                message: "Todo not found"
            });
            return;
        }
        // Success response
        res.status(200).json({
            success: true,
            message: "Todo updated successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.updatePrivateTodo = updatePrivateTodo;
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todoId = req.params.id;
        const userId = req.userId;
        if (!mongodb_1.ObjectId.isValid(todoId)) {
            res.status(400).json({ message: "Invalid Todo ID" });
            return;
        }
        const result = yield privateTodosCollection().deleteOne({
            _id: new mongodb_1.ObjectId(todoId),
            userId: new mongodb_1.ObjectId(userId) //  ensures only owner can delete
        });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "Todo not found or unauthorized" });
            return;
        }
        res.status(200).json({ message: "Todo deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteTodo = deleteTodo;
const getPrivateTodos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = new mongodb_1.ObjectId(req.userId); // Convert userId to ObjectId
    try {
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }
        const todos = yield privateTodosCollection().find({ userId: new mongodb_1.ObjectId(userId) }).toArray();
        res.status(200).json({
            success: true,
            message: "Todos retrieved successfully",
            data: todos
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.getPrivateTodos = getPrivateTodos;
