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
        if (!authHeader) {
            res.status(401).json({ message: "No token provided" });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Invalid token format" });
            return;
        }
        if (!process.env.JWT_SECRET) {
            res.status(500).json({ message: "JWT_SECRET missing" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("🔥 DECODED TOKEN:", decoded);
        if (!decoded.userId) {
            res.status(401).json({ message: "userId missing in token" });
            return;
        }
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        console.error("🔥 AUTH ERROR:", err);
        res.status(401).json({
            message: (err === null || err === void 0 ? void 0 : err.message) || "Invalid token"
        });
        return;
    }
};
exports.authMiddleware = authMiddleware;
