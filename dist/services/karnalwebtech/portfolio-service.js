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
const ImageUpload_1 = require("../../utils/ImageUpload");
const ErrorHandler_1 = __importDefault(require("../../utils/ErrorHandler"));
const imageRepository_1 = __importDefault(require("../../utils/comman-repositories/imageRepository"));
const seo_repositorie_1 = __importDefault(require("../../utils/comman-repositories/seo-repositorie"));
const imageUploader = new ImageUpload_1.ImageUploader();
const add_image = new imageRepository_1.default();
class PortfoliotService {
    constructor(portfoliotRepository) {
        this.portfoliotRepository = portfoliotRepository;
    }
    // Utility function for centralized error handling
    handleError(message, next, code = 404) {
        next(new ErrorHandler_1.default(message, code));
    }
    // Upload and save image with database entry
    handleImage(files, user_id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadedImage = yield imageUploader.uploadImage(files, next, "karnalwebtech");
            if (!uploadedImage) {
                this.handleError("Image upload failed on the server", next);
                return null;
            }
            const imageData = yield add_image.createImage(files, uploadedImage, user_id, next, "karnalwebtech");
            if (!imageData) {
                this.handleError("Image not added to database", next);
                return null;
            }
            return { uploadedImage, imageData };
        });
    }
    // Main method to create the post
    create(data, files, user_id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imageResult = yield this.handleImage(files, user_id, next);
                if (!imageResult)
                    return;
                const { uploadedImage, imageData } = imageResult;
                const seo = yield seo_repositorie_1.default.create(data, uploadedImage, next);
                if (!seo) {
                    return this.handleError("SEO data not added to database", next);
                }
                return yield this.portfoliotRepository.create(data, imageData, seo, user_id, next);
            }
            catch (error) {
                next(new ErrorHandler_1.default(error.message || "Internal Server Error", 500));
            }
        });
    }
    update(data, files, user_id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingCategory = yield this.portfoliotRepository.findBYpageid(data.id, next);
                if (!existingCategory) {
                    return this.handleError("post ID does not exist", next, 400);
                }
                const existingUrl = yield this.portfoliotRepository.findBYUrl(data.metaCanonicalUrl, existingCategory._id);
                if (existingUrl) {
                    return this.handleError("post with this URL already exists", next, 400);
                }
                let imageData = null;
                if (files === null || files === void 0 ? void 0 : files.length) {
                    const imageResult = yield this.handleImage(files, user_id, next);
                    if (!imageResult)
                        return;
                    imageData = imageResult.imageData;
                }
                const seo = yield seo_repositorie_1.default.update(data, existingCategory === null || existingCategory === void 0 ? void 0 : existingCategory.seo, imageData, next);
                if (!seo) {
                    return this.handleError("SEO data not added to database", next);
                }
                return yield this.portfoliotRepository.update(data, imageData, user_id, next);
            }
            catch (error) {
                next(new ErrorHandler_1.default(error.message || "Internal Server Error", 500));
            }
        });
    }
    findByUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.portfoliotRepository.findByUrl(url);
        });
    }
    all(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.portfoliotRepository.all(query);
        });
    }
    data_counter(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.portfoliotRepository.data_counter(query);
        });
    }
    find_by_id(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.portfoliotRepository.find_by_id(id, next);
        });
    }
    findBYpageid(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.portfoliotRepository.findBYpageid(id, next);
        });
    }
    removeItem(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.portfoliotRepository.removeItem(id, next);
        });
    }
}
exports.default = PortfoliotService;
