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
const userModel_1 = __importDefault(require("../../models/primary/userModel"));
const apiFeatuers_1 = __importDefault(require("../../utils/apiFeatuers"));
const ErrorHandler_1 = __importDefault(require("../../utils/ErrorHandler"));
const generateRandomId_1 = require("../../utils/generateRandomId");
const portfolio_model_1 = __importDefault(require("../../models/karnalwebtech/portfolio-model"));
const imageRepository_1 = __importDefault(require("../../utils/comman-repositories/imageRepository"));
const imageRepository = new imageRepository_1.default();
class PortfoliotRepository {
    // Reusable function to generate unique post ID
    generatePostId(uuid, randomId, number) {
        return `ptfo_${randomId.toLowerCase()}_${uuid}${number}`;
    }
    // Reusable function to get the next post number
    getNextPostNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield portfolio_model_1.default.countDocuments();
            return count + 1;
        });
    }
    // Helper function for populating category data
    populatePostData(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return query.populate([
                { path: "audit_log", model: userModel_1.default },
                { path: "feature_image", model: "Karnal_Images" },
                { path: "categorie", model: "Karnal_categorie" },
                { path: "tag", model: "Karnal_tag" },
                { path: "seo", model: "Karnal_web_seo" },
            ]);
        });
    }
    // Create a new post
    create(data, image_data, seo, user_id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const randomId = (0, generateRandomId_1.generateRandomId)();
                const { title, content, uuid, categorie, tags, description, status, metaCanonicalUrl, } = data;
                const imageIds = image_data.map((item) => item._id);
                // Get next post number
                const postNumber = yield this.getNextPostNumber();
                // Generate post ID
                const catId = this.generatePostId(uuid, randomId, postNumber);
                // Prepare data to be saved
                const newPostData = {
                    _no: postNumber,
                    title,
                    content,
                    status,
                    description,
                    categorie: categorie
                        ? categorie.split(",")
                        : ["6741bd2663fa4c1a8dd7548b"], // Default categorie ID
                    tag: tags ? tags.split(",") : ["6741bd9d63fa4c1a8dd7549f"], // Default tag ID
                    slug: metaCanonicalUrl.toLowerCase(),
                    feature_image: imageIds[0],
                    seo: seo === null || seo === void 0 ? void 0 : seo._id,
                    ptfo_id: catId,
                    audit_log: user_id,
                };
                // Prepare image update promises for updating the displayed path and activating the image
                if (imageIds) {
                    const updateData = {
                        displayedpath: newPostData.slug.toLowerCase(), // Set the displayed path to the category slug
                        is_active: true, // Mark the image as active
                    };
                    const oldImageId = "";
                    yield imageRepository.updateImage(imageIds, "karnalwebtech", oldImageId, updateData, next);
                }
                // Create and save the new post
                const post = new portfolio_model_1.default(newPostData);
                return yield post.save();
            }
            catch (error) {
                throw new Error(`Error creating portfolio: ${error.message}`);
            }
        });
    }
    // Find post by URL
    findByUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield portfolio_model_1.default.findOne({ slug: url });
        });
    }
    // Retrieve all post with filters and pagination
    all(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultPerPage = Number(query.rowsPerPage);
            const apiFeatures = new apiFeatuers_1.default(portfolio_model_1.default.find({ is_delete: { $ne: true } }), query);
            apiFeatures.search().filter().sort().pagination(resultPerPage);
            // Apply population and execute query
            const result = yield apiFeatures
                .getQuery()
                .populate([
                { path: "audit_log", model: userModel_1.default },
                { path: "feature_image", model: "Karnal_Images" },
                { path: "categorie", model: "Karnal_categorie" },
                { path: "tag", model: "Karnal_tag" },
                { path: "seo", model: "Karnal_web_seo" },
            ])
                .sort({ updated_at: -1 })
                .exec();
            return result;
        });
    }
    // Get the total count of [pst] based on filters
    data_counter(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiFeatures = new apiFeatuers_1.default(portfolio_model_1.default.find({ is_delete: { $ne: true } }), query);
            apiFeatures.search().filter();
            const result = yield apiFeatures.exec();
            return result.length;
        });
    }
    // Find portfolio by ID
    find_by_id(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.populatePostData(portfolio_model_1.default.findById(id));
            if (!result) {
                return next(new ErrorHandler_1.default(`portfolio with ID ${id} not found`, 404));
            }
            return result;
        });
    }
    // Update a portfolio
    update(data, image_data, user_id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, content, categorie, description, tags, status, metaCanonicalUrl, } = data;
            const image_ids = (image_data === null || image_data === void 0 ? void 0 : image_data.length)
                ? image_data.map((item) => item._id)
                : data === null || data === void 0 ? void 0 : data.images;
            const updated_data = {
                title,
                content,
                description,
                categorie: categorie
                    ? categorie.split(",")
                    : ["6741bd2663fa4c1a8dd7548b"], // Default categorie ID
                tag: tags ? tags.split(",") : ["6741bd9d63fa4c1a8dd7549f"], // Default tag ID
                status: status === "" ? "published" : status,
                slug: metaCanonicalUrl.toLowerCase(),
                feature_image: (image_ids === null || image_ids === void 0 ? void 0 : image_ids.length) ? image_ids : undefined,
                audit_log: user_id,
            };
            const post_prev_data = yield portfolio_model_1.default.findOne({
                ptfo_id: data.id,
            });
            const updated_post = yield portfolio_model_1.default.findOneAndUpdate({ ptfo_id: data.id }, updated_data, {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            });
            if (!updated_post) {
                throw new Error("Post not found");
            }
            if (image_ids) {
                const updateData = {
                    displayedpath: updated_post.slug.toLowerCase(), // Set the displayed path to the category slug
                    is_active: true, // Mark the image as active
                };
                const oldImageId = post_prev_data.feature_image._id;
                yield imageRepository.updateImage(image_ids, "karnalwebtech", oldImageId, updateData, next);
            }
            return updated_post;
        });
    }
    // Find post by URL and exclude certain ID
    findBYUrl(url, excludeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { slug: url };
            if (excludeId)
                query._id = { $ne: excludeId }; // Exclude specified ID
            return yield portfolio_model_1.default.findOne(query);
        });
    }
    // Find post by page ID
    findBYpageid(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.populatePostData(portfolio_model_1.default.findOne({ ptfo_id: id }));
            if (!result) {
                return next(new ErrorHandler_1.default(`Post with ID ${id} not found`, 404));
            }
            return result;
        });
    }
    removeItem(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.populatePostData(portfolio_model_1.default.findOne({ ptfo_id: id }));
            if (!result) {
                return next(new ErrorHandler_1.default(`portfolio with ID ${id} not found`, 404));
            }
            result.is_delete = true;
            yield result.save();
            return result;
        });
    }
}
exports.default = PortfoliotRepository;
