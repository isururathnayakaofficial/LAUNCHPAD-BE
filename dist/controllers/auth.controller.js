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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = void 0;
const db_1 = require("../config/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_utils_1 = require("../utils/jwt.utils");
const usersCollection = () => (0, db_1.getDB)().collection("users");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                message: "Name, email, password are required",
            });
            return;
        }
        const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : email;
        const existingUser = yield usersCollection().findOne({
            email: normalizedEmail,
        });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "User already exists",
            });
            return;
        }
        const encriptPassword = yield bcrypt_1.default.hash(password, 12);
        const result = yield usersCollection().insertOne({
            name,
            email: normalizedEmail,
            password: encriptPassword,
        });
        const token = (0, jwt_utils_1.generateToken)(result.insertedId.toString());
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                id: result.insertedId,
                name,
                email: normalizedEmail,
            },
            token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createUser = createUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
            return;
        }
        const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : email;
        const user = yield usersCollection().findOne({
            email: normalizedEmail,
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
                data: null,
            });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
                data: null,
            });
            return;
        }
        const token = (0, jwt_utils_1.generateToken)(user._id.toString());
        const { password: _ } = user, safeUser = __rest(user, ["password"]);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: safeUser,
            token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
