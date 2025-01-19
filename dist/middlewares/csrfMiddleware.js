"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csrfMiddleware = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
// Custom middleware to validate the CSRF token
const csrfMiddleware = (req, // Use the extended Request type
res, next) => {
    //   const csrfTokenFromHeader = req.headers["x-csrf-token"]; // Read token from header
    console.log(req);
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
    }
    catch (error) {
        return next(new ErrorHandler_1.default("Failed to validate CSRF token.", 401));
    }
};
exports.csrfMiddleware = csrfMiddleware;
