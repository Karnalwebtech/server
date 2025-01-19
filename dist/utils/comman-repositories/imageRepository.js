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
const image_model_handler_1 = require("../models-handler/image-model-handler");
const apiFeatuers_1 = __importDefault(require("../apiFeatuers"));
const ErrorHandler_1 = __importDefault(require("../ErrorHandler"));
const seo_repositorie_1 = __importDefault(require("./seo-repositorie"));
const userModel_1 = __importDefault(require("../../models/primary/userModel"));
class ImageRepository {
    createImage(data_1, image_uploader_1, user_id_1, next_1) {
        return __awaiter(this, arguments, void 0, function* (data, image_uploader, user_id, next, image_key = "crm") {
            try {
                // Create an array to hold image objects
                const images_arr = [];
                const counter = yield (0, image_model_handler_1.getImageModel)(image_key).countDocuments();
                // Check if data is an array or an object
                if (Array.isArray(data)) {
                    // Handle the case when data is an array
                    data.forEach((image, i) => {
                        var _a;
                        images_arr.push({
                            _no: counter + 1 + i,
                            fieldname: image.fieldname,
                            originalname: image.originalname,
                            encoding: image.encoding,
                            mimetype: image.mimetype,
                            destination: image.destination,
                            filename: image.filename,
                            path: ((_a = image_uploader[i]) === null || _a === void 0 ? void 0 : _a.url) || "", // Use optional chaining to avoid errors
                            size: image.size,
                            audit_log: user_id,
                        });
                    });
                }
                else if (typeof data === "object" && data !== null) {
                    // Handle the case when data is an object
                    Object.entries(data).forEach(([key, value], entryIndex) => {
                        if (Array.isArray(value)) {
                            value.forEach((image, i) => {
                                var _a;
                                images_arr.push({
                                    _no: counter + 1 + i,
                                    fieldname: key,
                                    originalname: image.originalname,
                                    encoding: image.encoding,
                                    mimetype: image.mimetype,
                                    destination: image.destination,
                                    filename: image.filename,
                                    path: ((_a = image_uploader[entryIndex]) === null || _a === void 0 ? void 0 : _a.url) || "", // Use optional chaining to avoid errors
                                    size: image.size,
                                    audit_log: user_id,
                                });
                            });
                        }
                    });
                }
                else {
                    return next(new Error("Invalid data format.")); // Handle the case with invalid data format
                }
                // Insert multiple images into the database if images_arr is populated
                if (images_arr.length > 0) {
                    const createdImages = yield (0, image_model_handler_1.getImageModel)(image_key).insertMany(images_arr); // Insert the accumulated images array
                    return createdImages; // Return saved images
                }
                else {
                    return next(new Error("No images to insert.")); // Handle the case with no images
                }
            }
            catch (error) {
                next(error); // Handle the error
            }
        });
    }
    all(query, image_key, User) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultPerPage = Number(query.rowsPerPage);
            const apiFeatures = new apiFeatuers_1.default((0, image_model_handler_1.getImageModel)(image_key).find({ is_delete: { $ne: true } }), query);
            apiFeatures.search().filter().sort().pagination(resultPerPage);
            // Apply population and execute query
            const result = yield apiFeatures
                .getQuery()
                .populate([
                { path: "audit_log", model: User },
                { path: "seo", model: "Karnal_web_seo" },
            ])
                .sort({ updated_at: -1 })
                .exec();
            return result;
        });
    }
    data_counter(query, image_key) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiFeatures = new apiFeatuers_1.default((0, image_model_handler_1.getImageModel)(image_key).find({ is_delete: { $ne: true } }), query);
            apiFeatures.search().filter();
            const result = yield apiFeatures.exec();
            return result.length;
        });
    }
    findById(id, image_key, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, image_model_handler_1.getImageModel)(image_key)
                .findOne({ _id: id })
                .populate([
                { path: "audit_log", model: userModel_1.default },
                { path: "seo", model: "Karnal_web_seo" },
            ]);
            if (!result) {
                return next(new ErrorHandler_1.default(`Image with ID ${id} not found`, 404));
            }
            return result;
        });
    }
    update(data, image_key, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { title, description, alt, metaCanonicalUrl } = data;
            const isExist = yield (0, image_model_handler_1.getImageModel)(image_key)
                .findOne({
                _id: data === null || data === void 0 ? void 0 : data.id,
            })
                .populate("seo");
            if (!isExist) {
                return next(new ErrorHandler_1.default(`Image with ID ${data === null || data === void 0 ? void 0 : data.id} not found`, 404));
            }
            let seo = null;
            if ((_a = isExist === null || isExist === void 0 ? void 0 : isExist.seo) === null || _a === void 0 ? void 0 : _a._id) {
                seo = yield seo_repositorie_1.default.update(data, isExist.seo, [], next); // Pass an empty array for imageData if not available
            }
            else {
                seo = yield seo_repositorie_1.default.create(data, [], next, metaCanonicalUrl); // Fallback image_uploader to empty array
            }
            if (!(seo === null || seo === void 0 ? void 0 : seo._id)) {
                return next(new ErrorHandler_1.default("SEO data not updated", 400)); // Ensure SEO was created or updated successfully
            }
            const updated_data = {
                title,
                caption: description,
                altText: alt,
                seo: seo === null || seo === void 0 ? void 0 : seo._id,
            };
            const result = yield (0, image_model_handler_1.getImageModel)(image_key).findByIdAndUpdate({ _id: data === null || data === void 0 ? void 0 : data.id }, updated_data, {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            });
            if (!result) {
                return next(new ErrorHandler_1.default("Data not updated", 404));
            }
            return result;
        });
    }
    updateImage(image_ids, key, oldImageId, updateData, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ImageModel = (0, image_model_handler_1.getImageModel)(key);
                // Update old image if it exists
                if (oldImageId) {
                    yield ImageModel.findByIdAndUpdate(oldImageId, updateData, {
                        new: true,
                    });
                }
                if (Array.isArray(image_ids)) {
                    // Deactivate the old image if not in the new image list
                    if (!image_ids.includes(oldImageId) && oldImageId) {
                        yield ImageModel.findByIdAndUpdate(oldImageId, { is_active: false }, { new: true });
                    }
                    // Activate the new images
                    const imageUpdatePromises = image_ids.map((id) => ImageModel.findByIdAndUpdate(id, updateData, { new: true }));
                    yield Promise.all(imageUpdatePromises);
                }
            }
            catch (error) {
                console.error(`Error updating images: ${error.message}`);
                return next(new ErrorHandler_1.default(`Error updating images: ${error.message}`, 500));
            }
        });
    }
}
exports.default = ImageRepository;
