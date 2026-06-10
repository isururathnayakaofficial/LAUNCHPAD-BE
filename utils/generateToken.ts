import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  return jwt.sign(
    { userId },                 // payload
    process.env.JWT_SECRET!,   // secret key
    { expiresIn: "7d" }        // expiry
  );
};