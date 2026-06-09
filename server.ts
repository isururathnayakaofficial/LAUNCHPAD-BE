import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import app from "./app";

dotenv.config();

const startServer = async () => {
  try {
    await connectDB(); // 🔥 test DB connection

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();