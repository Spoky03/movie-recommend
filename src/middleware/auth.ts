import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
// Middleware to authenticate JWT token
const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(401).send("Access Denied");
    }
  
    try {
      const verified = jwt.verify(token, JWT_SECRET);
      (req as any).user = verified;
      next();
    } catch (err) {
      res.status(400).send("Invalid Token");
    }
    return;
  };

export { authenticateJWT };