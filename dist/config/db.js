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
exports.connectDB = connectDB;
exports.getDB = getDB;
const mongodb_1 = require("mongodb");
let client;
let db;
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        try {
            client = new mongodb_1.MongoClient(uri);
            yield client.connect();
            console.log("MongoDB Connected");
            db = client.db("launchpad");
            return db;
        }
        catch (error) {
            console.error("MongoDB connection error:", error);
            throw error;
        }
    });
}
function getDB() {
    if (!db) {
        throw new Error("Database not initialized. Call connectDB first.");
    }
    return db;
}
