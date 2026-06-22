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
        const profileId = req.params.id;

        if (!userId || !profileId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Profile ID are required"
            });
        }

        const profile = await startupProfileCollection().findOne({
            _id: new ObjectId(profileId),
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
