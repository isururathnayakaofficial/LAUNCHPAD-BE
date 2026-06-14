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
exports.createCustomer = exports.getCustomers = void 0;
const db_1 = require("../config/db");
const customersCollection = () => (0, db_1.getDB)().collection("customers");
const getCustomers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield customersCollection().find({}).toArray();
        res.status(200).json({
            success: true,
            message: "Customers fetched successfully",
            data: customers,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCustomers = getCustomers;
const createCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone } = req.body;
        const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : email;
        const existingCustomer = yield customersCollection().findOne({ email: normalizedEmail });
        if (existingCustomer) {
            res.status(409).json({
                success: false,
                message: "Customer already exists",
            });
            return;
        }
        const result = yield customersCollection().insertOne({
            name,
            email: normalizedEmail,
            phone,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        res.status(201).json({
            success: true,
            message: "Customer created successfully",
            data: {
                _id: result.insertedId,
                name,
                email: normalizedEmail,
                phone,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createCustomer = createCustomer;
