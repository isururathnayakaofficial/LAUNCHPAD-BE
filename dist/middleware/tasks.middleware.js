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
exports.checkTaskOwnership = void 0;
const db_1 = require("../config/db");
const mongodb_1 = require("mongodb");
const tasksCollection = () => (0, db_1.getDB)().collection('tasks');
const checkTaskOwnership = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }
        if (!mongodb_1.ObjectId.isValid(taskId)) {
            res.status(400).json({
                success: false,
                message: "Invalid task ID"
            });
            return;
        }
        const task = yield tasksCollection().findOne({ _id: new mongodb_1.ObjectId(taskId) });
        if (!task) {
            res.status(404).json({
                success: false,
                message: "Task not found or you do not have permission to access it"
            });
            return;
        }
        //req.task = task;
        next();
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.checkTaskOwnership = checkTaskOwnership;
