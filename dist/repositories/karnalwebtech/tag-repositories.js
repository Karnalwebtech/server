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
const tag_1 = __importDefault(require("../../models/karnalwebtech/tag"));
const imageRepository_1 = __importDefault(require("../../utils/comman-repositories/imageRepository"));
const imageRepository = new imageRepository_1.default();
class TagRepository {
    // Reusable function to generate unique category ID
    generateId(uuid, randomId, number) {
        return `tag_${randomId.toLowerCase()}_${uuid}${number}`;
    }
    // Reusable function to get the next category number
    getNextTagNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield tag_1.default.countDocuments();
            return count + 1;
        });
    }
    // Helper function for populating category data
    populateTagData(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return query.populate([
                { path: "audit_log", model: userModel_1.default },
                { path: "feature_image", model: "Karnal_Images" },
                { path: "seo", model: "Karnal_web_seo" },
            ]);
        });
    }
    // Create a new category
    create(data, image_data, seo, user_id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const randomId = (0, generateRandomId_1.generateRandomId)();
                const { title, description, content, uuid, type, status, metaCanonicalUrl, } = data;
                const imageIds = image_data.map((item) => item._id);
                // Get next category number
                const counter = yield this.getNextTagNumber();
                // Generate category ID
                const tag_id = this.generateId(uuid, randomId, counter);
                // Prepare data to be saved
                const newData = {
                    _no: counter,
                    title,
                    description,
                    content,
                    status,
                    type: type,
                    slug: metaCanonicalUrl.toLowerCase(),
                    feature_image: imageIds[0],
                    seo: seo === null || seo === void 0 ? void 0 : seo._id,
                    tag_id: tag_id,
                    audit_log: user_id,
                };
                if (imageIds) {
                    const updateData = {
                        displayedpath: newData.slug.toLowerCase(), // Set the displayed path to the category slug
                        is_active: true, // Mark the image as active
                    };
                    const oldImageId = "";
                    yield imageRepository.updateImage(imageIds, "karnalwebtech", oldImageId, updateData, next);
                }
                // Create and save the new tag
                const new_data = new tag_1.default(newData);
                return yield new_data.save();
            }
            catch (error) {
                throw new Error(`Error creating tag: ${error.message}`);
            }
        });
    }
    // Find tag by URL
    findByUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tag_1.default.findOne({ slug: url });
        });
    }
    // Retrieve all tag with filters and pagination
    all(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultPerPage = Number(query.rowsPerPage);
            const apiFeatures = new apiFeatuers_1.default(tag_1.default.find({ is_delete: { $ne: true } }), query);
            apiFeatures.search().filter().sort().pagination(resultPerPage);
            // Apply population and execute query
            const result = yield apiFeatures
                .getQuery()
                .populate([
                { path: "audit_log", model: userModel_1.default },
                { path: "feature_image", model: "Karnal_Images" },
                { path: "seo", model: "Karnal_web_seo" },
            ])
                .sort({ updated_at: -1 })
                .exec();
            return result;
        });
    }
    // Get the total count of categories based on filters
    data_counter(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiFeatures = new apiFeatuers_1.default(tag_1.default.find({ is_delete: { $ne: true } }), query);
            apiFeatures.search().filter();
            const result = yield apiFeatures.exec();
            return result.length;
        });
    }
    // Find tag by ID
    find_by_id(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield this.populateTagData(tag_1.default.findById(id));
            if (!tag) {
                return next(new ErrorHandler_1.default(`tag with ID ${id} not found`, 404));
            }
            return tag;
        });
    }
    // Update a tag
    update(data, image_data, user_id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, description, content, status, metaCanonicalUrl } = data;
            const image_ids = (image_data === null || image_data === void 0 ? void 0 : image_data.length)
                ? image_data.map((item) => item._id)
                : data === null || data === void 0 ? void 0 : data.images;
            const updated_data = {
                title,
                content,
                description,
                status: status === "" ? "published" : status,
                slug: metaCanonicalUrl.toLowerCase(),
                feature_image: (image_ids === null || image_ids === void 0 ? void 0 : image_ids.length) ? image_ids : undefined,
                audit_log: user_id,
            };
            const post_prev_data = yield tag_1.default.findOne({
                tag_id: data.id,
            });
            const result = yield tag_1.default.findOneAndUpdate({ tag_id: data.id }, updated_data, {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            });
            if (!result) {
                throw new Error("Tag not found");
            }
            if (image_ids) {
                const updateData = {
                    displayedpath: result.slug.toLowerCase(), // Set the displayed path to the category slug
                    is_active: true, // Mark the image as active
                };
                const oldImageId = post_prev_data.feature_image._id;
                yield imageRepository.updateImage(image_ids, "karnalwebtech", oldImageId, updateData, next);
            }
            return result;
        });
    }
    // Find tag by URL and exclude certain ID
    findBYUrl(url, excludeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { slug: url };
            if (excludeId)
                query._id = { $ne: excludeId }; // Exclude specified ID
            return yield tag_1.default.findOne(query);
        });
    }
    // Find category by page ID
    findBYpageid(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield this.populateTagData(tag_1.default.findOne({ tag_id: id }));
            if (!tag) {
                return next(new ErrorHandler_1.default(`tag with ID ${id} not found`, 404));
            }
            return tag;
        });
    }
    removeItem(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield this.populateTagData(tag_1.default.findOne({ tag_id: id }));
            if (!tag) {
                return next(new ErrorHandler_1.default(`tag with ID ${id} not found`, 404));
            }
            tag.is_delete = true;
            yield tag.save();
            return tag;
        });
    }
}
exports.default = TagRepository;
