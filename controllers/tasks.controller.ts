import {Request, Response} from 'express';
import {getDB} from '../config/db';
import {ObjectId} from 'mongodb';


interface taksAssign extends Request {

    userId?: string;
}

const tasks = () => getDB().collection("tasks");



  export const createTask = async (req:taksAssign,res:Response) => {

    const {title,email,role,description,mediaUrl} = req.body;
    const userId = req.userId;

    if(!userId){
        res.status(401).json({
            success:false,
            message:"Unauthorized"
        });
        return;
    }
    if(!title || !email || !role || !description){
        res.status(400).json({
            success:false,
            message:"Title, email, role and description are required"
        });
        return;
    }
    const inviteToken = new ObjectId().toString();

  }

