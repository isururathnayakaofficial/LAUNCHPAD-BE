import {Request, Response} from 'express';
import {getDB} from '../config/db';
import {ObjectId} from 'mongodb';
import {v4 as uuidv4} from 'uuid';
import { sendTaskEmail } from '../services/mail.service';
import {Multer} from 'multer';


interface taksAssign extends Request {

    userId?: string;
    file?:Express.Multer.File;
}

const tasks = () => getDB().collection("tasks");
const tasksToken = uuidv4();


  export const createTask = async (req:taksAssign,res:Response) => {
    const mediaUrl = req.file ? `${process.env.BACKEND_URL}/uploads/${req.file.filename}` : null;
    const {title,email,role,description} = req.body;
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
    await sendTaskEmail (email, title, joinLink);

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

  export const getSpecificTasks = async (
  req: taksAssign,
  res: Response
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    //  Get user from DB (IMPORTANT)
    const user = await getDB()
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    //  Use email to fetch tasks
    const specificTasks = await tasks()
      .find({ email: user.email })
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: specificTasks
    });

  } catch (error) {
    console.error("Error fetching specific tasks:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id as string;
    //const userId = req.userId;

    const result = await tasks().deleteOne({
      _id: new ObjectId(taskId),
     // email: userId //  ensures only owner can delete
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found or unauthorized"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting task:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id as string;

    const { title, description, role, status } = req.body;

    const updateData: any = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    const result = await tasks().updateOne(
      { _id: new ObjectId(taskId) },
      {
        $set: updateData
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully"
    });

  } catch (error) {
    console.error("Error updating task:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};