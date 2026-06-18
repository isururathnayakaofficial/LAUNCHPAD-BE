import {Request, Response} from 'express';
import {getDB} from '../config/db';
import {ObjectId} from 'mongodb';
import {v4 as uuidv4} from 'uuid';


interface taksAssign extends Request {

    userId?: string;
}

const tasks = () => getDB().collection("tasks");
const tasksToken = uuidv4();


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

    const result = await tasks().insertOne({
        title,
        email,
        role,
        description,
        mediaUrl: mediaUrl || null,
        token: tasksToken,
        status: "pending",
        createdAt: new Date()
    });
    const joinLink = `${process.env.FRONTEND_URL}/tasks/${tasksToken}`;

    res.status(201).json({
        success:true,
        message:"Task created successfully",
        data: {
            id: result.insertedId,
            title,
            email,
            role,
            description,
            mediaUrl: mediaUrl || null,
            token: tasksToken,
            status: "pending", 
            joinLink,         
            createdAt: new Date()
        }
    }); 

    

  }

