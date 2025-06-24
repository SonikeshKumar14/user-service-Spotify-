import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser, User } from "./model.js";

export interface AuthenticatedRequest extends Request {
    user? : IUser | null
}

export const isAuth = async(req: AuthenticatedRequest, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const token = req.headers.token as string;

    if(!token){
        res.status(400).json({
            message: "Please Login",
        })
        return;
    }
    const decodedValue = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload 
    if(!decodedValue || !decodedValue._id){
      res.status(403).json({
        message: "Invalid token"
      })
      return;
    }
    const userId = decodedValue._id;
    const user = await User.findById(userId).select("-password");
    if(!user){
        res.status(403).json({
          message: "User not found",
        })
        return;
    }

    req.user = user
    next();
} catch {
    res.status(403).json({
        message: "Please Login",
    })
  }
}