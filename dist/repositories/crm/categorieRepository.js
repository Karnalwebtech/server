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
const categorieModel_1 = __importDefault(require("../../models/primary/categorieModel"));
const generateRandomId_1 = require("../../utils/generateRandomId");
const apiFeatuers_1 = __importDefault(require("../../utils/apiFeatuers"));
const ErrorHandler_1 = __importDefault(require("../../utils/ErrorHandler"));
class CategorieRepository {
    createCategorie(data, image_data, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rendom_id = (0, generateRandomId_1.generateRandomId)();
            const { name, description, uuid, status } = data;
            const image_ids = image_data.map((item) => item._id);
            const counter = yield categorieModel_1.default.countDocuments();
            const updated_data = {
                _no: counter + 1,
                cat_id: `cat_${uuid}_${rendom_id}`,
                name,
                description,
                status,
                images_id: image_ids,
                audit_log: user_id,
            };
            const Categorie = new categorieModel_1.default(updated_data);
            return yield Categorie.save();
        });
    }
    update(data, image_data, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, images, status } = data;
            const image_ids = Array.isArray(image_data) && image_data.length > 0
                ? image_data.map((item) => item._id)
                : [];
            const updated_data = {
                name,
                description,
                status,
                images_id: image_ids.length > 0 ? image_ids : images,
                audit_log: user_id,
            };
            const updated_custome_data = yield categorieModel_1.default.findByIdAndUpdate(data.id, updated_data, {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            });
            if (!updated_custome_data) {
                throw new Error("Categorie not found");
            }
            return updated_custome_data;
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield categorieModel_1.default.findOne({ name: name });
            return customer;
        });
    }
    all_categorie(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultPerPage = Number(query.rowsPerPage);
            const apiFeatures = new apiFeatuers_1.default(categorieModel_1.default.find(), query);
            apiFeatures.search().filter().sort().pagination(resultPerPage);
            const result = yield apiFeatures
                .getQuery() // Use the public getter
                .populate([
                {
                    path: "audit_log",
                    model: "User",
                },
                {
                    path: "images_id",
                    model: "Images",
                },
            ])
                .sort({ updated_at: -1 })
                .exec();
            return result;
        });
    }
    data_counter(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiFeatures = new apiFeatuers_1.default(categorieModel_1.default.find(), query);
            apiFeatures.search().filter();
            const result = yield apiFeatures.exec();
            return result.length;
        });
    }
    find_by_id_and_update(id, data, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const Category = yield categorieModel_1.default.findById(id);
            if (!Category) {
                return next(new ErrorHandler_1.default(`Category with ID ${id} not found`, 404));
            }
            Category.is_active = data.state;
            Category.is_delete = data.hard_delete;
            yield Category.save();
            return Category;
        });
    }
    find_by_id(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const Category = yield categorieModel_1.default.findById(id).populate([
                {
                    path: "audit_log",
                    model: "User",
                },
                {
                    path: "images_id",
                    model: "Images",
                },
            ]);
            if (!Category) {
                return next(new ErrorHandler_1.default(`Category with ID ${id} not found`, 404));
            }
            return Category;
        });
    }
}
exports.default = CategorieRepository;
