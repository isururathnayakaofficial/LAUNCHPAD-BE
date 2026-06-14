"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const privateTodos_controller_1 = require("../controllers/privateTodos.controller");
const router = (0, express_1.Router)();
//router.get("/getAll", getPrivateTodos);
router.post("/save", privateTodos_controller_1.createPrivateTodo);
exports.default = router;
