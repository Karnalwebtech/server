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
const redis_1 = require("../../../loaders/redis");
class TagController {
    constructor(tagService) {
        this.tagService = tagService;
        // Create tag with error handling and cleaner response
        this.create = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id; // Use the correct type for the request user
            const files = req.files;
            // Check if URL already exists
            const isExistingUrl = yield this.tagService.findByUrl(req.body.metaCanonicalUrl);
            if (isExistingUrl) {
                return next(new ErrorHandler_1.default("Url already exists, try another one", 400)); // Changed to 400
            }
            // Validate user authentication
            if (!userId) {
                return next(new ErrorHandler_1.default("User is not authenticated", 401)); // Changed to 401
            }
            // Create category
            const result = yield this.tagService.create(req.body, files, userId, next);
            if (result) {
                return this.sendResponse(res, "Tag created successfully", 201);
            }
            return next(new ErrorHandler_1.default("Failed to create category", 500));
        }));
        // Get all categories with pagination
        this.all = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const resultPerPage = Number(query.rowsPerPage);
            const cacheKey = `tags_${new URLSearchParams(query).toString()}`;
            const catCashe = yield redis_1.redisClient2.get(cacheKey);
            if (catCashe) {
                console.log("cashe his");
                return res.json(JSON.parse(catCashe)); // Return cached posts
            }
            console.log("cashe miss");
            // Fetch tag and data counter
            const [result, dataCounter] = yield Promise.all([
                this.tagService.all(query),
                this.tagService.data_counter(query),
            ]);
            const cacheData = {
                success: true,
                message: "Tag cache fetched successfully",
                data: {
                    result: result, // Assuming result is plain data
                    rowsPerPage: resultPerPage,
                    dataCounter: dataCounter,
                },
            };
            yield redis_1.redisClient2.set(cacheKey, JSON.stringify(cacheData));
            return this.sendResponse(res, "Tag fetched successfully", 200, {
                result,
                resultPerPage,
                dataCounter,
            });
        }));
        // Get single tag by ID
        this.get_single_data = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                return next(new ErrorHandler_1.default("ID parameter is required.", 400));
            }
            const cacheKey = `${id}`;
            console.log(`Checking cache for key: ${cacheKey}`);
            const cachedPosts = yield redis_1.redisClient2.get(cacheKey);
            if (cachedPosts) {
                console.log("Cache hit");
                return res.json(JSON.parse(cachedPosts)); // Return cached posts
            }
            console.log("Cache miss");
            // Fetch tag by ID
            const result = yield this.tagService.findBYpageid(id, next);
            if (result) {
                const cacheData = {
                    success: true,
                    message: "Tag cache fetched successfully",
                    data: result,
                };
                yield redis_1.redisClient2.set(cacheKey, JSON.stringify(cacheData)); // Cache for 1 hour
                return this.sendResponse(res, "Tag fetched successfully", 200, result);
            }
            return next(new ErrorHandler_1.default("Tag not found", 404));
        }));
        // Update category
        this.update = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user._id;
            const files = req.files;
            if (!user) {
                return next(new ErrorHandler_1.default("User not authenticated", 401)); // Changed to 401
            }
            // Update Tag
            const result = yield this.tagService.update(req.body, files, user, next);
            if (result) {
                return this.sendResponse(res, "Tag updated successfully", 200);
            }
            return next(new ErrorHandler_1.default("Failed to update tag", 500));
        }));
        this.removeItem = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const categorie = yield this.tagService.removeItem(id, next);
            if (categorie) {
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
exports.default = TagController;
