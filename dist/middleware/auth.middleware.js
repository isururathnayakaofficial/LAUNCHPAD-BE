"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        //  Check header exists
        if (!authHeader) {
            res.status(401).json({
                success: false,
                message: "Authorization header missing"
            });
            return;
        }
        //  Validate Bearer format
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            res.status(401).json({
                success: false,
                message: "Invalid authorization format. Use Bearer token"
            });
            return;
        }
        const token = parts[1];
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Token missing"
            });
            return;
        }
        //Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            res.status(401).json({
                success: false,
                message: "Invalid token payload"
            });
            return;
        }
        //Attach user to request
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorized - Token verification failed"
        });
    }
};
exports.authMiddleware = authMiddleware;
