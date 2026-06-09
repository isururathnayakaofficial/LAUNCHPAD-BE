import { Request, Response, NextFunction } from "express";
import { getDB } from "../config/db";

const customersCollection = () => getDB().collection("customers");

export const getCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customers = await customersCollection().find({}).toArray();

    res.status(200).json({
      success: true,
      message: "Customers fetched successfully",
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, phone } = req.body;
    const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : email;

    const existingCustomer = await customersCollection().findOne({ email: normalizedEmail });

    if (existingCustomer) {
      res.status(409).json({
        success: false,
        message: "Customer already exists",
      });
      return;
    }

    const result = await customersCollection().insertOne({
      name,
      email: normalizedEmail,
      phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: {
        _id: result.insertedId,
        name,
        email: normalizedEmail,
        phone,
      },
    });
  } catch (error) {
    next(error);
  }
};