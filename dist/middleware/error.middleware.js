"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    res.status(500).json({
        success: false,
        message: err.message,
    });
};
exports.errorHandler = errorHandler;
