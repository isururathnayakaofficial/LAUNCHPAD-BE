import {Request, Response} from 'express';
import {getDB} from '../config/db';
import {MongoInvalidArgumentError, ObjectId} from 'mongodb';
import {v4 as uuidv4} from 'uuid';
import { sendTaskEmail } from '../services/mail.service';
import {Multer} from 'multer';
import Crypto from 'crypto';


interface taksAssign extends Request {

    userId?: string;
    file?:Express.Multer.File;
}

const tasks = () => getDB().collection("tasks");



export const createTask = async (req: any, res: Response) => {
  try {
    const { title, email, role, description } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!title || !email || !role || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, email, role and description are required"
      });
    }


    // 🔥 CLOUDINARY SAFE EXTRACTION
   const multipleFiles = req.files as any[] | undefined;

const mediaUrls =
  multipleFiles?.map(file => file.path || file.secure_url) || [];

    const tasksToken = crypto.randomUUID();

    const result = await getDB().collection("tasks").insertOne({
      title,
      email,
      role,
      description,
      mediaUrl: mediaUrls,
      inviteToken: tasksToken,
      status: "pending",
      createdAt: new Date(),
      userId
    });

    const joinLink = `${process.env.FRONTEND_URL}/tasks/${tasksToken}`;

    try {
      await sendTaskEmail(email, title, joinLink);
    } catch (emailError) {
      console.error("EMAIL ERROR:", emailError);
    }

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        id: result.insertedId,
        title,
        email,
        role,
        description,
        mediaUrl: mediaUrls,
        inviteToken: tasksToken,
        status: "pending",
        joinLink,
        createdAt: new Date()
      }
    });

  } catch (error: any) {
  
  
  console.error(" STRINGIFIED ERROR:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
  console.log("REQ BODY:", req.body);
console.log("REQ FILES:", req.files);
  return res.status(500).json({
    success: false,
    message: error?.message || "Unknown error",
    fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
  });
}
};

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