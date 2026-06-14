"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const privateTodos_routers_1 = __importDefault(require("./routes/privateTodos.routers"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/customers", customer_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/private-todos", privateTodos_routers_1.default);
dotenv_1.default.config();
exports.default = app;
