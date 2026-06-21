import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Invalid token format" });
      return;
    }

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: "JWT_SECRET missing" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId?: string;
    };

    console.log("🔥 DECODED TOKEN:", decoded);

    if (!decoded.userId) {
      res.status(401).json({ message: "userId missing in token" });
      return;
    }

    req.userId = decoded.userId;

    next();
  } catch (err: any) {
    console.error("🔥 AUTH ERROR:", err);

    res.status(401).json({
      message: err?.message || "Invalid token"
    });
    return;
  }
};