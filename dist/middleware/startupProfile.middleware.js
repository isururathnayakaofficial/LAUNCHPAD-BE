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
exports.checkAlreadyHaveProfile = exports.checkProfileOwnership = void 0;
const db_1 = require("../config/db");
const mongodb_1 = require("mongodb");
const startupProfileCollection = () => (0, db_1.getDB)().collection("profile");
const checkProfileOwnership = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        // const profileId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }
        if (!mongodb_1.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }
        const profile = yield startupProfileCollection().findOne({
            userId: new mongodb_1.ObjectId(userId)
        });
        if (!profile) {
            return res.status(403).json({
                success: false,
                message: "You are not the owner of this profile"
            });
        }
        req.profile = profile;
        next();
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});
exports.checkProfileOwnership = checkProfileOwnership;
const checkAlreadyHaveProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }
        if (!mongodb_1.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }
        const checkAlreadyHaveProfile = yield startupProfileCollection().countDocuments({
            userId: new mongodb_1.ObjectId(userId)
        });
        if (checkAlreadyHaveProfile >= 1) {
            return res.status(400).json({
                success: false,
                message: "You already have a profile.You can not make a new ACompany Profile uisng this email"
            });
        }
        else {
            next();
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});
exports.checkAlreadyHaveProfile = checkAlreadyHaveProfile;
