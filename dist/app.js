"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// load env FIRST
dotenv_1.default.config({
    path: path_1.default.resolve(process.cwd(), ".env"),
});
const express_1 = __importDefault(require("express"));
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const privateTodos_routers_1 = __importDefault(require("./routes/privateTodos.routers"));
const startupProfile_router_1 = __importDefault(require("./routes/startupProfile.router"));
const task_routers_1 = __importDefault(require("./routes/task.routers"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const allowedOrigins = [
    "http://localhost:5173",
    "https://launchpadpro-three.vercel.app"
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express_1.default.json());
app.use("/api/customers", customer_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/private-todos", privateTodos_routers_1.default);
app.use("/api/tasks", task_routers_1.default);
app.use("/api/profile", startupProfile_router_1.default);
exports.default = app;
