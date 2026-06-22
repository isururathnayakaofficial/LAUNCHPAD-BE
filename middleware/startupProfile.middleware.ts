import {Request, Response, NextFunction} from 'express';
import {getDB} from '../config/db';
import {ObjectId} from 'mongodb';

interface StartupProfileRequest extends Request {
    params: any;
    userId?: string;
    profile?: any;
}

const startupProfileCollection = () => getDB().collection("profile")

export const checkProfileOwnership = async (
    req: StartupProfileRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.userId;
       // const profileId = req.params.id;

        if (!userId ) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const profile = await startupProfileCollection().findOne({
            
            userId: new ObjectId(userId)
        });

        if (!profile) {
            return res.status(403).json({
                success: false,
                message: "You are not the owner of this profile"
            });
        }

        req.profile = profile;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const checkAlreadyHaveProfile = async (
    req: StartupProfileRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const checkAlreadyHaveProfile = await startupProfileCollection().countDocuments({

            userId: new ObjectId(userId)
        });
        if (checkAlreadyHaveProfile >= 1) {
            return res.status(400).json({
                success: false,
                message: "You already have a profile.You can not make a new ACompany Profile uisng this email"
            });
        } else {
            next();
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
