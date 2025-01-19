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
const userModel_1 = __importDefault(require("../../../models/primary/userModel"));
const ErrorHandler_1 = __importDefault(require("../../../utils/ErrorHandler"));
class ImageController {
    constructor(imageRepository) {
        this.imageRepository = imageRepository;
        // Get all categories with pagination
        this.all = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const resultPerPage = Number(query.rowsPerPage) || 25;
            // Fetch tag and data counter
            const [result, dataCounter] = yield Promise.all([
                this.imageRepository.all(query, "karnalwebtech", userModel_1.default),
                this.imageRepository.data_counter(query, "karnalwebtech"),
            ]);
            return this.sendResponse(res, "image fetched successfully", 200, {
                result,
                resultPerPage,
                dataCounter,
            });
        }));
        this.get_single_data = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                return next(new ErrorHandler_1.default("ID parameter is required.", 400));
            }
            const result = yield this.imageRepository.findById(id, "karnalwebtech", next);
            if (result) {
                return res.status(200).json({
                    success: true,
                    message: "Image fetched successfully",
                    data: result,
                });
            }
            return next(new ErrorHandler_1.default("Image not found", 404));
        }));
        this.update = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            if (!data.id) {
                return next(new ErrorHandler_1.default("ID parameter is required.", 400));
            }
            const result = yield this.imageRepository.update(data, "karnalwebtech", next);
            if (result) {
                return res.status(200).json({
                    success: true,
                    message: "Image update successfully",
                });
            }
            return next(new ErrorHandler_1.default("Image not found", 404));
        }));
    }
    sendResponse(res, message, statusCode, data = null) {
        return res.status(statusCode).json({
            success: statusCode < 400,
            message,
            data,
        });
    }
}
exports.default = ImageController;
