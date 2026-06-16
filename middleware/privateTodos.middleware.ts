import {Request, Response, NextFunction} from 'express';
import {getDB} from '../config/db';
import {ObjectId} from 'mongodb';


interface PrivateTodoRequest extends Request {
    userId?: string;
    todos?: any[];
}

const todosCollection = () => getDB().collection('privateTodos');


export const checkTodoOwnership = async (
    req: PrivateTodoRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {

    try {

        const todoId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const userId = req.userId;


        if(!userId){
            res.status(401).json({
                success:false,
                message:"Unauthorized"
            });
            return;
        }


        if (!ObjectId.isValid(todoId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid todo id'
            });

            return;
        }

        const todo = await todosCollection()
        .findOne({
            _id:new ObjectId(todoId)
        });


        if(!todo){

            res.status(404).json({
                success:false,
                message:'Todo not found'
            });

            return;
        }


        if(todo.userId.toString() !== userId){

            res.status(403).json({
                success:false,
                message:'Unauthorized to access this todo'
            });

            return;
        }


        next();


    } catch(error){

        res.status(500).json({
            success:false,
            message:'Internal server error'
        });

    }
};




export const filterPrivateTodos = async (
    req:PrivateTodoRequest,
    res:Response,
    next:NextFunction
):Promise<void> => {


    try {


        const userId = req.userId;


        if(!userId){

            res.status(401).json({
                success:false,
                message:"Unauthorized"
            });

            return;
        }


        const todos = await todosCollection()
        .find({
            userId:new ObjectId(userId)
        })
        .toArray();


        req.todos = todos;


        next();



    } catch(error){

        res.status(500).json({
            success:false,
            message:'Internal server error'
        });

    }

};