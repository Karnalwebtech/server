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
const AsyncHandler_1 = __importDefault(require("../../../middlewares/AsyncHandler"));
const ErrorHandler_1 = __importDefault(require("../../../utils/ErrorHandler"));
class ContactUsController {
    constructor(contactUsService) {
        this.contactUsService = contactUsService;
        // Create post with error handling and cleaner response
        this.create = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.contactUsService.create(req.body, next);
            if (result) {
                return this.sendResponse(res, "Data created successfully", 201);
            }
            return next(new ErrorHandler_1.default("Failed to create image", 500));
        }));
        // Get all post with pagination
        this.all = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            console.log(query);
            const resultPerPage = Number(query.rowsPerPage) || 25;
            const [result, dataCounter] = yield Promise.all([
                this.contactUsService.all(query),
                this.contactUsService.data_counter(query),
            ]);
            return this.sendResponse(res, "Contact fetched successfully", 200, {
                result,
                resultPerPage,
                dataCounter,
            });
        }));
        // Get single post by ID
        this.get_single_data = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                return next(new ErrorHandler_1.default("ID parameter is required.", 400));
            }
            const result = yield this.contactUsService.findBYpageid(id, next);
            if (result) {
                return this.sendResponse(res, "Contact fetched successfully", 200, result);
            }
            return next(new ErrorHandler_1.default("Contact not found", 404));
        }));
        this.update = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user._id;
            if (!user) {
                return next(new ErrorHandler_1.default("User not authenticated", 401)); // Changed to 401
            }
            // Update post
            const result = yield this.contactUsService.update(req.body, user, next);
            if (result) {
                return this.sendResponse(res, "Contact updated successfully", 200);
            }
            return next(new ErrorHandler_1.default("Failed to update Contact", 500));
        }));
        this.removeItem = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const result = yield this.contactUsService.removeItem(id, next);
            if (result) {
                return res.status(200).json({
                    succes: true,
                });
            }
        }));
    }
    // Helper function to send a consistent response
    sendResponse(res, message, statusCode, data = null) {
        return res.status(statusCode).json({
            success: statusCode < 400,
            message,
            data,
        });
    }
}
exports.default = ContactUsController;
