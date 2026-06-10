import { Request,Response,NextFunction } from "express";
import { getDB } from "../config/db";

const privateTodosCollection = () => getDB().collection("privateTodos");

export const createPrivateTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description } = req.body;
    const userId = req.userId; // Assuming userId is set in auth middleware
    if (!title) {
      res.status(400).json({ success: false, message: 'Title and description are required' });
      return;
    }
    const result = await privateTodosCollection().insertOne({
      title,
      description,
      userId: new ObjectId(userId),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    res.status(201).json({ success: true, message: 'Todo created successfully', data: { id: result.insertedId, title, description } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
  next();
};
