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
const post_model_1 = __importDefault(require("../../models/karnalwebtech/post-model"));
const ErrorHandler_1 = __importDefault(require("../ErrorHandler"));
const post_categorie_1 = __importDefault(require("../../models/karnalwebtech/post-categorie"));
const image_model_1 = __importDefault(require("../../models/karnalwebtech/image-model"));
class PostService {
    static getPostUrls(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const urls = yield post_model_1.default.find({ is_delete: { $ne: true } }, { slug: 1, categorie: 1, updatedAt: 1, _id: 0 }).populate({
                    path: "categorie",
                    select: "slug -_id",
                });
                return res.status(200).json(urls);
            }
            catch (error) {
                return next(new ErrorHandler_1.default(`Error fetching URLs: ${error}`, 404));
            }
        });
    }
    static getImageUrls(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const urls = yield image_model_1.default.find({ is_delete: { $ne: true }, is_active: { $ne: false } }, {
                    path: 1,
                    title: 1,
                    displayedpath: 1,
                    caption: 1,
                    updatedAt: 1,
                    _id: 0,
                });
                return res.status(200).json(urls);
            }
            catch (error) {
                return next(new ErrorHandler_1.default(`Error fetching URLs: ${error}`, 404));
            }
        });
    }
    static getCategorieUrls(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const urls = yield post_categorie_1.default.find({ is_delete: { $ne: true }, type: { $ne: "portfolio" } }, { title: 1, slug: 1, updatedAt: 1, _id: 0 });
                return res.status(200).json(urls);
            }
            catch (error) {
                return next(new ErrorHandler_1.default(`Error fetching URLs: ${error}`, 404));
            }
        });
    }
}
exports.default = PostService;
