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
const generateRandomId_1 = require("../../utils/generateRandomId");
const productModel_1 = __importDefault(require("../../models/primary/productModel"));
const apiFeatuers_1 = __importDefault(require("../../utils/apiFeatuers"));
const ErrorHandler_1 = __importDefault(require("../../utils/ErrorHandler"));
const mongoose_1 = __importDefault(require("mongoose"));
class ProductRepository {
    createProduct(data, image_data, user_id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const rendom_id = (0, generateRandomId_1.generateRandomId)();
            const toNumber = (value) => (isNaN(Number(value)) ? 0 : Number(value));
            // Destructure and prepare image ids
            const image_ids = image_data.map((item) => item._id);
            const counter = yield productModel_1.default.countDocuments();
            const updated_data = {
                _no: counter + 1,
                prod_id: `prod_${data.uuid}_${rendom_id}`,
                name: data.name,
                status: data.status,
                selling_price: toNumber(data.selling_price),
                tax: data.tax,
                primary_unit: data.primary_unit,
                sku: data.sku,
                hsn: data.hsn,
                purchase_price: toNumber(data.purchase_price),
                total_quantity: toNumber(data.total_quantity),
                barcode: data.barcode,
                weight: toNumber(data.weight),
                depth: toNumber(data.depth),
                width: toNumber(data.width),
                height: toNumber(data.height),
                images_id: image_ids,
                audit_log: user_id,
            };
            if (data.categorie && mongoose_1.default.Types.ObjectId.isValid(data.categorie)) {
                updated_data.categorie = data.categorie;
            }
            try {
                const Product = new productModel_1.default(updated_data);
                return yield Product.save();
            }
            catch (error) {
                return next(new ErrorHandler_1.default(error, 404));
            }
        });
    }
    update(data, image_data, user_id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const toNumber = (value) => (isNaN(Number(value)) ? 0 : Number(value));
            const image_ids = Array.isArray(image_data) && image_data.length > 0
                ? image_data.map((item) => item._id)
                : [];
            const updated_data = {
                name: data.name,
                status: data.status,
                selling_price: toNumber(data.selling_price),
                tax: data.tax,
                primary_unit: data.primary_unit,
                sku: data.sku,
                hsn: data.hsn,
                purchase_price: toNumber(data.purchase_price),
                total_quantity: toNumber(data.total_quantity),
                barcode: data.barcode,
                weight: toNumber(data.weight),
                depth: toNumber(data.depth),
                width: toNumber(data.width),
                height: toNumber(data.height),
                images_id: image_ids.length > 0 ? image_ids : data.images && data.images,
                audit_log: user_id,
            };
            if (data.categorie && mongoose_1.default.Types.ObjectId.isValid(data.categorie)) {
                updated_data.categorie = data.categorie;
            }
            try {
                const updated_custome_data = yield productModel_1.default.findByIdAndUpdate(data.id, updated_data, {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false,
                });
                if (!updated_custome_data) {
                    return next(new ErrorHandler_1.default("Product not found", 404));
                }
                return updated_custome_data;
            }
            catch (error) {
                return next(new ErrorHandler_1.default(error, 404));
            }
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield productModel_1.default.findOne({ name: name });
            return customer;
        });
    }
    all(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultPerPage = Number(query.rowsPerPage);
            const apiFeatures = new apiFeatuers_1.default(productModel_1.default.find(), query);
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
                {
                    path: "categorie",
                    model: "Categorie",
                },
            ])
                .sort({ updated_at: -1 })
                .exec();
            return result;
        });
    }
    data_counter(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiFeatures = new apiFeatuers_1.default(productModel_1.default.find(), query);
            apiFeatures.search().filter();
            const result = yield apiFeatures.exec();
            return result.length;
        });
    }
    find_by_id_and_update(id, data, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield productModel_1.default.findById(id);
            if (!product) {
                return next(new ErrorHandler_1.default(`Product with ID ${id} not found`, 404));
            }
            product.is_active = data.state;
            product.is_delete = data.hard_delete;
            yield product.save();
            return product;
        });
    }
    find_by_id(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield productModel_1.default.findById(id).populate([
                {
                    path: "audit_log",
                    model: "User",
                },
                {
                    path: "images_id",
                    model: "Images",
                },
                {
                    path: "categorie",
                    model: "Categorie",
                },
            ]);
            if (!product) {
                return next(new ErrorHandler_1.default(`Product with ID ${id} not found`, 404));
            }
            return product;
        });
    }
}
exports.default = ProductRepository;
