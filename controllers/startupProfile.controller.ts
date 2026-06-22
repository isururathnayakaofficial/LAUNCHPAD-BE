import {Request ,Response ,NextFunction} from 'express';
import {getDB} from '../config/db';
import {ObjectId} from 'mongodb';

interface StartupProfileRequest extends Request {
    userId?: string;
}
const startupProfileCollection = () => getDB().collection("profile")

export const CreateProfile = async (
    req: StartupProfileRequest,
    res: Response,
    next:NextFunction
):Promise<void> => {
    try{
      const {companyName,tagLine,currentStage,industry,teamSize,} = req.body;
      const userId =req.userId;

      if (!companyName || !currentStage || !industry || !teamSize){
        res.status(400).json({
            success:false,
            message:"All details are required"
        })
        return;
      }
      const result = await startupProfileCollection().insertOne({
        companyName,
        tagLine,
        currentStage,
        industry,
        teamSize,
        userId:new ObjectId(userId),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      res.status(201).json({
        success:true,
        message:"Profile Configed Successfully",
        data:{
            id:result.insertedId,
            companyName,
            tagLine,
            currentStage,
            industry,
            teamSize,
        }
      })
    }catch(error){
        res.status(500).json({
            sucess:false,
            message:"Internal Server Error"
        });
    }

}

export const getProfile = async (
    req: StartupProfileRequest,
    res: Response,
    next:NextFunction
):Promise<void> => {
    try{
        if(!req.userId){
            res.status(401).json({
                success:false,
                message:"Unauthorized"
            });
            return;
        }
        const profile = await startupProfileCollection().find({userId:new ObjectId(req.userId)}).toArray();
        res.status (200).json({
            success:true,
            message:"Profile fetched successfully",
            data:profile
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
}