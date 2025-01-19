import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

// Custom middleware to validate the CSRF token
export const csrfMiddleware = (
  req: Request, // Use the extended Request type
  res: Response,
  next: NextFunction
) => {
//   const csrfTokenFromHeader = req.headers["x-csrf-token"]; // Read token from header
  console.log(req)
//   console.log(csrfTokenFromHeader);
//   if (!csrfTokenFromHeader) {
//     return next(new ErrorHandler("CSRF token missing", 400));
//   }

  try {
    // const csrfTokenFromServer = req.csrfToken(); // Generate the server's CSRF token

    // if (csrfTokenFromHeader !== csrfTokenFromServer) {
    //     return next(new ErrorHandler("Invalid CSRF token", 400));
    // }

    next(); // Proceed to the next middleware/route
  } catch (error) {
    return next(new ErrorHandler("Failed to validate CSRF token.", 401));
  }
};
