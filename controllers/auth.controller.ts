import { Request, Response, NextFunction } from "express";
import { getDB } from "../config/db";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.utils";

const usersCollection = () => getDB().collection("users");

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email, password are required",
      });
      return;
    }

    const normalizedEmail =
      typeof email === "string" ? email.toLowerCase().trim() : email;

    
    const existingUser = await usersCollection().findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    
    const encriptPassword = await bcrypt.hash(password, 12);

    const result = await usersCollection().insertOne({
      name,
      email: normalizedEmail,
      password: encriptPassword,
    });

    
    const token = generateToken(result.insertedId.toString());

    res.status(201).json({
      success: true,
      message: "User created successfully",

     
      data: {
        id: result.insertedId,
        name,
        email: normalizedEmail,
      },

      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

   
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const normalizedEmail =
      typeof email === "string" ? email.toLowerCase().trim() : email;

    const user = await usersCollection().findOne({
      email: normalizedEmail,
    });

    
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
        data: null,
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
        data: null,
      });
      return;
    }

    const token = generateToken(user._id.toString());

    
    const { password: _, ...safeUser } = user;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: safeUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};