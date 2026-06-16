import { Request, Response, NextFunction } from "express";
import { getDB } from "../config/db";
import { ObjectId } from "mongodb";


interface PrivateTodoRequest extends Request {
  //json inside have string this type coversion user to decode it

  userId?: string;
}

const privateTodosCollection = () => getDB().collection("privateTodos");


export const createPrivateTodo = async (
  req: PrivateTodoRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {

  try {

    const { title, description,status } = req.body;

    const userId = req.userId;


    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    }


    if (!title) {
      res.status(400).json({
        success: false,
        message: "Title is required"
      });
      return;
    }


    const result = await privateTodosCollection().insertOne({

      title,

      description,

      status: status || "pending",

      userId: new ObjectId(userId),

      createdAt: new Date(),

      updatedAt: new Date()

    });


    res.status(201).json({

      success: true,

      message: "Todo created successfully",

      data: {
        id: result.insertedId,
        title,
        description,
        status: "pending"
      }

    });


  } catch (error) {

    res.status(500).json({

      success:false,

      message:"Internal server error"

    });

  }

};

export const updatePrivateTodo = async (
  req: PrivateTodoRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, status } = req.body;
    const todoId = req.params.id as string;
    const userId = req.userId;

    // Auth check
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    }

    //  Validate todoId
    if (!ObjectId.isValid(todoId)) {
      res.status(400).json({
        success: false,
        message: "Invalid todo id"
      });
      return;
    }

    //  At least one field required
    if (!title && !description && !status) {
      res.status(400).json({
        success: false,
        message: "At least one field (title, description, status) is required to update"
      });
      return;
    }

    const collection = privateTodosCollection();

    // Single optimized update query
    const result = await collection.updateOne(
      {
        _id: new ObjectId(todoId),
        userId: new ObjectId(userId)
      },
      {
        $set: {
          ...(title && { title }),
          ...(description && { description }),
          ...(status && { status }),
          updatedAt: new Date()
        }
      }
    );

    //  Handle not found
    if (result.matchedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Todo not found"
      });
      return;
    }

    // Success response
    res.status(200).json({
      success: true,
      message: "Todo updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const deleteTodo = async (req: PrivateTodoRequest, res: Response): Promise<void> => {
    try {
        const todoId = req.params.id as string;
        const userId = req.userId;

        if (!ObjectId.isValid(todoId)) {
            res.status(400).json({ message: "Invalid Todo ID" });
            return;
        }

        const result = await privateTodosCollection().deleteOne({
            _id: new ObjectId(todoId),
            userId:new ObjectId(userId) //  ensures only owner can delete
        });

        if (result.deletedCount === 0) {
            res.status(404).json({ message: "Todo not found or unauthorized" });
            return;
        }

        res.status(200).json({ message: "Todo deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getPrivateTodos = async (
    req: PrivateTodoRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
 
 const userId = new ObjectId(req.userId); // Convert userId to ObjectId
    try {
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }
         
        const todos = await privateTodosCollection().find({userId: new ObjectId(userId)}).toArray();
        res.status(200).json({
            success: true,
            message: "Todos retrieved successfully",
            data: todos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }   
}
