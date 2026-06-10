import {Request,Response,NextFunction} from "express";
import {getDB} from "../config/db";
import bcrypt from "bcrypt";


const usersCollection = () => getDB().collection("users");
export const createUser = async (
    req: Request,
    res:Response,
    next:NextFunction
): Promise<void> => {
    try{
        const {name,email,password} = req.body;
        const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : email;
        const existingUser = await usersCollection().findOne({email:normalizedEmail});
        const encriptPassword = await bcrypt.hash(password, 10);

        if(existingUser){
            res.status(409).json({
                success:false,
                message:"User already exists",
            });
            return;
        }
      const result = await usersCollection().insertOne({
        name,
        email:normalizedEmail,
        password :encriptPassword,
      });
      res.status(201).json({
        success:true,
        message:"User created successfully",
        data:result
      });
    }catch(error){
        next(error);
    }
}
export const loginUser = async (
    req: Request,
    res:Response,
    next:NextFunction
): Promise<void> => {
    try{
        const {email,password} = req.body;
        const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : email;
        const user = await usersCollection().findOne({email:normalizedEmail});
        if(!user){
            res.status(401).json({
                success:false,  
                message:"Invalid email or password",
                data:null
            });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.status(401).json({
                success:false,
                message:"Invalid email or password",
                data:null
            });
            return;
        }
        res.status(200).json({
            success:true,
            message:"Login successful",
            data:user
        });
    }catch(error){
        next(error);
    }
}