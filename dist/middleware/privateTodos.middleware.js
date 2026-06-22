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
exports.filterPrivateTodos = exports.checkTodoOwnership = void 0;
const db_1 = require("../config/db");
const mongodb_1 = require("mongodb");
const todosCollection = () => (0, db_1.getDB)().collection('privateTodos');
const checkTodoOwnership = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todoId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }
        if (!mongodb_1.ObjectId.isValid(todoId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid todo id'
            });
            return;
        }
        const todo = yield todosCollection()
            .findOne({
            _id: new mongodb_1.ObjectId(todoId)
        });
        if (!todo) {
            res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
            return;
        }
        if (todo.userId.toString() !== userId) {
            res.status(403).json({
                success: false,
                message: 'Unauthorized to access this todo'
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.checkTodoOwnership = checkTodoOwnership;
const filterPrivateTodos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }
        const todos = yield todosCollection()
            .find({
            userId: new mongodb_1.ObjectId(userId)
        })
            .toArray();
        req.todos = todos;
        next();
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.filterPrivateTodos = filterPrivateTodos;
