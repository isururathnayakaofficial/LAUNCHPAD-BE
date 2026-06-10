import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

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

    //  Check header exists
    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "Authorization header missing"
      });
      return;
    }

    //  Validate Bearer format
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      res.status(401).json({
        success: false,
        message: "Invalid authorization format. Use Bearer token"
      });
      return;
    }

    const token = parts[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token missing"
      });
      return;
    }

    //Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload & { userId: string };

    if (!decoded || !decoded.userId) {
      res.status(401).json({
        success: false,
        message: "Invalid token payload"
      });
      return;
    }

    //Attach user to request
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized - Token verification failed"
    });
  }
};