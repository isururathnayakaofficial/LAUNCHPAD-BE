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
exports.createPrivateTodo = void 0;
const db_1 = require("../config/db");
const mongodb_1 = require("mongodb");
const privateTodosCollection = () => (0, db_1.getDB)().collection("privateTodos");
const createPrivateTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
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
                description
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
