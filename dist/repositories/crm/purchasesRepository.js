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
const apiFeatuers_1 = __importDefault(require("../../utils/apiFeatuers"));
const ErrorHandler_1 = __importDefault(require("../../utils/ErrorHandler"));
const mongoose_1 = __importDefault(require("mongoose"));
const purchaseModel_1 = __importDefault(require("../../models/primary/purchaseModel"));
class PurchaseRepository {
    create(data, image_data, user_id, order_details, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const rendom_id = (0, generateRandomId_1.generateRandomId)();
            // Check if data.services is defined and a valid JSON string
            let service_data = {};
            if (data.services && data.services !== "undefined") {
                try {
                    service_data = JSON.parse(data.services);
                }
                catch (error) {
                    return next(new ErrorHandler_1.default("Invalid services JSON format", 400));
                }
            }
            // Extract image ids into merged object
            const merged = (image_data || []).reduce((acc, { fieldname, _id }) => {
                if (["image", "doket", "invoice"].includes(fieldname)) {
                    acc[`${fieldname}_id`] = _id;
                }
                return acc;
            }, {});
            const purchases_number = yield purchaseModel_1.default.countDocuments();
            // Build updated_data object
            const updated_data = {
                purchase_no: purchases_number + 1,
                purchase_id: `pur_${data.uuid}_${rendom_id}`,
                purchase_date: data.purchase_date,
                due_date: data.due_date,
                supplier_invoice_date: data.supplier_invoice_date,
                supplier_invoice_serial_no: data.supplier_invoice_serial_no,
                reference: data.reference,
                payment_mode: data.payment_mode,
                vendor: data.vendor,
                tax_status: data.tax_status,
                order_details: order_details._id,
                shipping_charges: service_data.shipping_charges || 0,
                discount: service_data.discount || 0,
                other_charge: service_data.other_charge || 0,
                notes: data.notes,
                audit_log: user_id,
            };
            // Validate and apply only if IDs are valid
            ["invoice_id", "doket_id", "image_id"].forEach((field) => {
                if (merged[field] && !mongoose_1.default.Types.ObjectId.isValid(merged[field])) {
                    delete updated_data[field]; // Remove invalid IDs
                }
            });
            const validMergedFields = Object.keys(merged).filter((field) => merged[field] && mongoose_1.default.Types.ObjectId.isValid(merged[field]));
            if (validMergedFields.length > 0) {
                validMergedFields.forEach((field) => {
                    updated_data[field] = merged[field];
                });
            }
            try {
                // Save the order
                const newOrder = new purchaseModel_1.default(updated_data);
                return yield newOrder.save();
            }
            catch (error) {
                console.log(error);
                return next(new ErrorHandler_1.default(error, 404));
            }
        });
    }
    update(data, image_data, user_id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let service_data = {};
            if (data.services && data.services !== "undefined") {
                try {
                    service_data = JSON.parse(data.services);
                }
                catch (error) {
                    return next(new ErrorHandler_1.default("Invalid services JSON format", 400));
                }
            }
            // Use reduce to create merged object from image_data
            const merged = (image_data || []).reduce((acc, { fieldname, _id }) => {
                if (["image", "doket", "invoice"].includes(fieldname)) {
                    acc[`${fieldname}_id`] = _id;
                }
                return acc;
            }, {});
            // Build updated_data object
            const updated_data = {
                purchase_date: data.purchase_date,
                due_date: data.due_date,
                supplier_invoice_date: data.supplier_invoice_date,
                supplier_invoice_serial_no: data.supplier_invoice_serial_no,
                reference: data.reference,
                payment_mode: data.payment_mode,
                vendor: data.vendor,
                tax_status: data.tax_status,
                shipping_charges: service_data.shipping_charges || 0,
                discount: service_data.discount || 0,
                other_charge: service_data.other_charge || 0,
                notes: data.notes,
                audit_log: user_id,
            };
            try {
                const updated_order_data = yield purchaseModel_1.default.findByIdAndUpdate(data.id, updated_data, {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false,
                });
                if (!updated_order_data) {
                    throw new Error("Purchase not found");
                }
            }
            catch (error) {
                console.log(error);
                return next(new ErrorHandler_1.default(error.message || "An error occurred", 404));
            }
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield purchaseModel_1.default.findOne({ name: name });
            return customer;
        });
    }
    all(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultPerPage = Number(query.rowsPerPage);
            const apiFeatures = new apiFeatuers_1.default(purchaseModel_1.default.find(), query);
            apiFeatures.search().filter().sort().pagination(resultPerPage);
            const result = yield apiFeatures
                .getQuery() // Use the public getter
                .populate([
                {
                    path: "vendor",
                    model: "Vendor",
                },
                {
                    path: "order_details",
                    model: "Orders_details",
                },
                {
                    path: "image_id",
                    model: "Images",
                },
                {
                    path: "doket_id",
                    model: "Images",
                },
                {
                    path: "invoice_id",
                    model: "Images",
                },
                {
                    path: "audit_log",
                    model: "User",
                },
            ])
                .sort({ updated_at: -1 })
                .exec();
            return result;
        });
    }
    data_counter(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiFeatures = new apiFeatuers_1.default(purchaseModel_1.default.find(), query);
            apiFeatures.search().filter();
            const result = yield apiFeatures.exec();
            return result.length;
        });
    }
    //   async find_by_id_and_update(id: string, data: any, next: NextFunction) {
    //     const product = await Purchase_model.findById(id);
    //     if (!product) {
    //       return next(new ErrorHandler(`Product with ID ${id} not found`, 404));
    //     }
    //     product.is_active = data.state;
    //     product.is_delete = data.hard_delete;
    //     await product.save();
    //     return product;
    //   }
    find_by_id(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield purchaseModel_1.default.findById(id).populate([
                {
                    path: "vendor",
                    model: "Vendor",
                },
                {
                    path: "order_details",
                    model: "Orders_details",
                },
                {
                    path: "image_id",
                    model: "Images",
                },
                {
                    path: "doket_id",
                    model: "Images",
                },
                {
                    path: "invoice_id",
                    model: "Images",
                },
                {
                    path: "audit_log",
                    model: "User",
                },
            ]);
            if (!order) {
                return next(new ErrorHandler_1.default(`Order with ID ${id} not found`, 404));
            }
            return order;
        });
    }
}
exports.default = PurchaseRepository;
