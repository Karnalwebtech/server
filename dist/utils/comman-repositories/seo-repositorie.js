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
const ErrorHandler_1 = __importDefault(require("../ErrorHandler"));
const seo_model_handler_1 = require("../models-handler/seo-model-handler");
// Utility function to generate SEO data
const generateSeoData = (data, ogImageUrl) => ({
    title: data.metaTitle || data.title,
    meta_description: data.metaDescription || "Karnal web tech",
    keywords: (data.keywords || "").split(","),
    og_title: data.metaTitle || data.title,
    og_description: data.metaDescription || "Karnal web tech",
    og_image: ogImageUrl,
    twitter_card: "summary_large_image",
    twitter_title: data.metaTitle || data.title,
    twitter_description: data.metaDescription || "Karnal web tech",
    twitter_image: ogImageUrl,
    canonical_url: data.metaCanonicalUrl.toLowerCase() || "",
});
class SeoRepositorie {
    // Create SEO record
    create(data, image_uploader, next, image_patgh) {
        var _a;
        const ogImageUrl = ((_a = image_uploader[0]) === null || _a === void 0 ? void 0 : _a.path) || image_patgh; // Fallback to an empty string if undefined
        try {
            const seo_data = generateSeoData(data, ogImageUrl);
            const seo = (0, seo_model_handler_1.getSeoModel)("karnalwebtech").create(seo_data);
            return seo;
        }
        catch (error) {
            return this.handleError(error, next);
        }
    }
    // Update SEO record
    update(data, prev_seo_data, imageData, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = prev_seo_data._id;
            const prev_image = prev_seo_data === null || prev_seo_data === void 0 ? void 0 : prev_seo_data.og_image;
            const current_image = imageData && imageData.length > 0 ? (_a = imageData[0]) === null || _a === void 0 ? void 0 : _a.path : prev_image;
            try {
                const seo_data = generateSeoData(data, current_image);
                return yield (0, seo_model_handler_1.getSeoModel)("karnalwebtech").findByIdAndUpdate(id, seo_data, {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false,
                });
            }
            catch (error) {
                return this.handleError(error, next);
            }
        });
    }
    // Centralized error handling
    handleError(error, next) {
        if (error instanceof Error) {
            return next(new ErrorHandler_1.default(error.message, 404));
        }
        return next(new ErrorHandler_1.default("An unknown error occurred", 404));
    }
}
exports.default = new SeoRepositorie();
