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
exports.getProfile = exports.CreateProfile = void 0;
const db_1 = require("../config/db");
const mongodb_1 = require("mongodb");
const startupProfileCollection = () => (0, db_1.getDB)().collection("profile");
const CreateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyName, tagLine, currentStage, industry, teamSize, } = req.body;
        const userId = req.userId;
        if (!companyName || !currentStage || !industry || !teamSize) {
            res.status(400).json({
                success: false,
                message: "All details are required"
            });
            return;
        }
        const result = yield startupProfileCollection().insertOne({
            companyName,
            tagLine,
            currentStage,
            industry,
            teamSize,
            userId: new mongodb_1.ObjectId(userId),
            createdAt: new Date(),
            updatedAt: new Date()
        });
        res.status(201).json({
            success: true,
            message: "Profile Configed Successfully",
            data: {
                id: result.insertedId,
                companyName,
                tagLine,
                currentStage,
                industry,
                teamSize,
            }
        });
    }
    catch (error) {
        res.status(500).json({
            sucess: false,
            message: "Internal Server Error"
        });
    }
});
exports.CreateProfile = CreateProfile;
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }
        const profile = yield startupProfileCollection().find({ userId: new mongodb_1.ObjectId(req.userId) }).toArray();
        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: profile
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});
exports.getProfile = getProfile;
