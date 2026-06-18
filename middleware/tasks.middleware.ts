import { Request ,Response,NextFunction } from "express";
import {getDB} from '../config/db';
import {ObjectId} from 'mongodb';

interface TaskRequest extends Request {
    userId?: string;
    tasks?: any[];
}

const tasksCollection = () => getDB().collection('tasks');

export const checkTaskOwnership = async (
    req: TaskRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const userId = req.userId;
        

        if(!userId){
            res.status(401).json({
                success:false,
                message:"Unauthorized"
            });
            return;
        }
        if (!ObjectId.isValid(taskId)) {
            res.status(400).json({
                success: false,
                message: "Invalid task ID"
            });
            return;
        }
        const task = await tasksCollection().findOne({ _id: new ObjectId(taskId) });

        if (!task) {
            res.status(404).json({
                success: false,
                message: "Task not found or you do not have permission to access it"
            });
            return;
        }
        //req.task = task;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
