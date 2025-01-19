"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal server error';
    // Wrong MongoDB ID error
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler_1.default(message, 404);
    }
    // MongoDB duplicate key errors
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler_1.default(message, 400);
    }
    // Wrong JWT error
    if (err.name === 'JsonWebTokenError') {
        const message = `Token invalid, try again`;
        err = new ErrorHandler_1.default(message, 400);
    }
    // JWT expire error
    if (err.name === 'TokenExpiredError') {
        const message = `Token expired, try again`;
        err = new ErrorHandler_1.default(message, 400);
    }
    console.log(err);
    res.status(err.statusCode).json({
        success: false,
        error: err.stack,
        message: err.message,
    });
};
exports.default = errorMiddleware;
