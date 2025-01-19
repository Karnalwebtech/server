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
class PostController {
    constructor(postService) {
        this.postService = postService;
        // Create post with error handling and cleaner response
        this.create = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id; // Use the correct type for the request user
            const files = req.files;
            // Check if URL already exists
            const isExistingUrl = yield this.postService.findByUrl(req.body.metaCanonicalUrl);
            if (isExistingUrl) {
                return next(new ErrorHandler_1.default("Url already exists, try another one", 400)); // Changed to 400
            }
            // Validate user authentication
            if (!userId) {
                return next(new ErrorHandler_1.default("User is not authenticated", 401)); // Changed to 401
            }
            // Create post
            const result = yield this.postService.create(req.body, files, userId, next);
            if (result) {
                return this.sendResponse(res, "Post created successfully", 201);
            }
            return next(new ErrorHandler_1.default("Failed to create post", 500));
        }));
        // Get all post with pagination
        this.all = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const resultPerPage = Number(query.rowsPerPage);
            const cacheKey = `posts_${new URLSearchParams(query).toString()}`;
            // // Check if data is in Redis cache
            const cachedPosts = yield redis_1.redisClient1.get(cacheKey);
            if (cachedPosts) {
                console.log("cashe hit");
                return res.json(JSON.parse(cachedPosts)); // Return cached posts
            }
            const [result, dataCounter] = yield Promise.all([
                this.postService.all(query),
                this.postService.data_counter(query),
            ]);
            const cacheData = {
                success: true,
                message: "Post cache fetched successfully",
                data: {
                    result: result, // Assuming result is plain data
                    rowsPerPage: resultPerPage,
                    dataCounter: dataCounter,
                },
            };
            console.log("cache miss");
            // // Store the result data in Redis cache (cache for 1 hour)
            yield redis_1.redisClient1.set(cacheKey, JSON.stringify(cacheData));
            return this.sendResponse(res, "Post fetched successfully", 200, {
                result,
                resultPerPage,
                dataCounter,
            });
        }));
        this.get_single_data = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id, slug } = req.params;
            if (!id && !slug) {
                return next(new ErrorHandler_1.default("Either ID or slug parameter is required.", 400));
            }
            // Generate cache key based on the id or slug
            const cacheKey = id ? `${id}` : `post_${slug}`;
            console.log(`Checking cache for key: ${cacheKey}`);
            try {
                // Check if data is in Redis cache
                const cachedPosts = yield redis_1.redisClient1.get(cacheKey);
                if (cachedPosts) {
                    console.log("Cache hit");
                    return res.json(JSON.parse(cachedPosts)); // Return cached posts
                }
                console.log("Cache miss");
                // Fetch post data from database
                const result = id
                    ? yield this.postService.findBYpageid(id, next)
                    : yield this.postService.findBYSlug(slug, next);
                if (result) {
                    // Store the result in Redis cache
                    const cacheData = {
                        success: true,
                        message: "Post cache fetched successfully",
                        data: result,
                    };
                    try {
                        yield redis_1.redisClient1.set(cacheKey, JSON.stringify(cacheData)); // Cache for 1 hour
                        console.log("Data cached successfully");
                    }
                    catch (cacheError) {
                        console.log("Cache set failed", cacheError);
                    }
                    return this.sendResponse(res, "Post fetched successfully", 200, result);
                }
                return next(new ErrorHandler_1.default("Post not found", 404));
            }
            catch (error) {
                console.log("Error in fetching post", error);
                return next(new ErrorHandler_1.default("Internal Server Error", 500));
            }
        }));
        // Update post
        this.update = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user._id;
            const files = req.files;
            if (!user) {
                return next(new ErrorHandler_1.default("User not authenticated", 401)); // Changed to 401
            }
            // Update post
            const result = yield this.postService.update(req.body, files, user, next);
            if (result) {
                return this.sendResponse(res, "Post updated successfully", 200);
            }
            return next(new ErrorHandler_1.default("Failed to update post", 500));
        }));
        this.removeItem = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const result = yield this.postService.removeItem(id, next);
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
exports.default = PostController;
