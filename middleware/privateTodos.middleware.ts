import {Request, Response, NextFunction} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {getDB} from '../config/db';
import {ObjectId} from 'mongodb';


const todosCollection = () => getDB().collection('todos');

export const checkTodoOwnership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const todoId = req.params.id;
        const userId = req.userId; // Assuming userId is set in auth middleware
        const todo = await todosCollection().findOne({_id: new ObjectId(todoId)});

        if (!todo) {
            res.status(404).json({success: false, message: 'Todo not found'});
            return;
        }

        if (todo.userId.toString() !== userId) {
            res.status(403).json({success: false, message: 'Unauthorized to access this todo'});
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const filterPrivateTodos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId; // Assuming userId is set in auth middleware
        const todos = await todosCollection().find({userId: new ObjectId(userId)}).toArray();
        req.todos = todos;

}
    catch (error) {
        res.status(500).json({success: false, message: 'Internal server error'});
    }   
    next();
};



