"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.isAuthenticatedUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/primary/userModel"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const isAuthenticatedUser = (req, // Use the extended Request type
res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const s_token = req.headers.authorization;
    const token = s_token && s_token.split(" ")[1];
    if (!token) {
        return next(new ErrorHandler_1.default("Please log in first", 400));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield userModel_1.default.findById(decoded.id);
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return next(new ErrorHandler_1.default("Token expired. Please log in again.", 401));
        }
        else {
            return next(new ErrorHandler_1.default("Invalid token. Please log in again.", 401));
        }
    }
});
exports.isAuthenticatedUser = isAuthenticatedUser;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        var _a;
        // Ensure req.user is defined and has a role property
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ErrorHandler_1.default(`Role: ${(_a = req.user) === null || _a === void 0 ? void 0 : _a.role} is not allowed to access this resource`, 403));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
