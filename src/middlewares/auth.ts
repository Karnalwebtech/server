import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/primary/userModel";
import ErrorHandler from "../utils/ErrorHandler";
import { IUser } from "../models/primary/userModel"; // Adjust this if necessary

interface CustomRequest extends Request {
  user?: IUser; // Use the IUser interface to match the user model
}

export const isAuthenticatedUser = async (
  req: Request, // Use the extended Request type
  res: Response,
  next: NextFunction
) => {
  const s_token: string | undefined = req.headers.authorization;
  
  const token: string | undefined = s_token && s_token.split(" ")[1];
  if (!token) {
    return next(new ErrorHandler("Please log in first", 400));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    (req as any).user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ErrorHandler("Token expired. Please log in again.", 401));
    } else {
      return next(new ErrorHandler("Invalid token. Please log in again.", 401));
    }
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    // Ensure req.user is defined and has a role property
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};
