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
const orderModel_1 = __importDefault(require("../../models/primary/orderModel"));
const addressModel_1 = __importDefault(require("../../models/primary/addressModel"));
class OrderRepository {
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
            const parse_shipping = JSON.parse(data.shipping_address);
            const shipping_data = Object.assign(Object.assign({}, parse_shipping), { audit_log: user_id });
            const [shipping_a] = yield Promise.all([
                addressModel_1.default.create(shipping_data),
            ]);
            const order_number = yield orderModel_1.default.countDocuments();
            // Build updated_data object
            const updated_data = {
                order_no: order_number + 1,
                order_id: `ord_${data.uuid}_${rendom_id}`,
                order_date: new Date(),
                order_status: data.order_status,
                tax_status: data.tax_status,
                customer: data.customer,
                dispatch_mod: data.dispatch_mod,
                invoice_no: data.invoice_no,
                payment_mode: data.payment_mode,
                name: data.name,
                shipping_charges: service_data.shipping_charges || 0,
                discount: service_data.discount || 0,
                other_charge: service_data.other_charge || 0,
                order_details: order_details._id,
                shipping_address: shipping_a._id,
                company: data.company,
                email: data.email,
                notes: data.notes,
                phone: data.phone,
                gstin: data.gstin,
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
                yield updateOrderStatus("create", data.order_status, "mome", order_details, user_id);
                // Save the order
                const newOrder = new orderModel_1.default(updated_data);
                return yield newOrder.save();
            }
            catch (error) {
                console.log(error);
                return next(new ErrorHandler_1.default(error, 404));
            }
        });
    }
    update(data, image_data, user_id, order_details, next) {
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
            const parse_shipping = JSON.parse(data.shipping_address);
            const shipping_data = Object.assign(Object.assign({}, parse_shipping), { audit_log: user_id });
            const [shipping_a] = yield Promise.all([
                addressModel_1.default.create(shipping_data),
            ]);
            // Build updated_data object
            const updated_data = {
                order_status: data.order_status,
                customer: data.customer,
                dispatch_mod: data.dispatch_mod,
                tax_status: data.tax_status,
                invoice_no: data.invoice_no,
                payment_mode: data.payment_mode,
                name: data.name,
                shipping_charges: service_data.shipping_charges || 0,
                discount: service_data.discount || 0,
                other_charge: service_data.other_charge || 0,
                order_details: order_details._id,
                shipping_address: shipping_a._id,
                company: data.company,
                email: data.email,
                notes: data.notes,
                phone: data.phone,
                gstin: data.gstin,
                audit_log: user_id,
                invoice_id: merged.invoice_id || data.invoice,
                doket_id: merged.doket_id || data.doket,
                image_id: merged.image_id || data.image,
            };
            try {
                const before_order_status = yield orderModel_1.default.findOne({ _id: data.id });
                if (before_order_status) {
                    yield updateOrderStatus("update", data.order_status, before_order_status.order_status, order_details, user_id);
                }
                const updated_order_data = yield orderModel_1.default.findByIdAndUpdate(data.id, updated_data, {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false,
                });
                if (!updated_order_data) {
                    throw new Error("Customer not found");
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
            const customer = yield productModel_1.default.findOne({ name: name });
            return customer;
        });
    }
    all(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultPerPage = Number(query.rowsPerPage);
            const apiFeatures = new apiFeatuers_1.default(orderModel_1.default.find(), query);
            apiFeatures.search().filter().sort().pagination(resultPerPage);
            const result = yield apiFeatures
                .getQuery() // Use the public getter
                .populate([
                {
                    path: "customer",
                    model: "Customer",
                },
                {
                    path: "shipping_address",
                    model: "Address",
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
            const apiFeatures = new apiFeatuers_1.default(orderModel_1.default.find(), query);
            apiFeatures.search().filter();
            const result = yield apiFeatures.exec();
            return result.length;
        });
    }
    //   async find_by_id_and_update(id: string, data: any, next: NextFunction) {
    //     const product = await Product_model.findById(id);
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
            const order = yield orderModel_1.default.findById(id).populate([
                {
                    path: "customer",
                    model: "Customer",
                },
                {
                    path: "shipping_address",
                    model: "Address",
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
exports.default = OrderRepository;
function updateOrderStatus(type, status, order_status, order_details, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (status) {
            case "processing":
                yield processOrder(order_status, order_details, user_id);
                break;
            // case "delivered":
            //   await handleDelivered(order_status, order_details, user_id);
            //   break;
            case "canceled":
                yield handleCanceled(type, status, order_status, order_details, user_id);
                break;
            case "refund":
                yield handleRefund(type, status, order_status, order_details, user_id);
                break;
            case "return":
                yield handleReturn(type, status, order_status, order_details, user_id);
                break;
            case "hold":
                yield handleHold(order_status, order_details, user_id);
                break;
            default:
                return;
        }
    });
}
// Function to process the order
function processOrder(order_status, order_details, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (order_status === "processing")
            return;
        const productUpdates = order_details.product_details.map((_a) => __awaiter(this, [_a], void 0, function* ({ product_id, quantity }) {
            return productModel_1.default.findOneAndUpdate({ _id: product_id }, { $inc: { total_quantity: -quantity } }, // Decrease total_quantity
            { new: true });
        }));
        yield Promise.all(productUpdates);
        console.log(`Order is being processed by user ${user_id}`);
    });
}
// Function for handling delivered orders
function handleDelivered(order_status, order_details, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        // You can add custom logic for a delivered order
        console.log(`Order delivered by user ${user_id}`);
    });
}
// Function for handling canceled orders
function handleCanceled(type, status, order_status, order_details, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (type === "create" ||
            order_status === "canceled" ||
            order_status === "returned" ||
            order_status === "refund") {
            return;
        }
        const productUpdates = order_details.product_details.map((_a) => __awaiter(this, [_a], void 0, function* ({ product_id, quantity }) {
            return productModel_1.default.findOneAndUpdate({ _id: product_id }, { $inc: { total_quantity: quantity } }, // Restore total_quantity
            { new: true });
        }));
        yield Promise.all(productUpdates);
        console.log(`Order canceled by user ${user_id}`);
    });
}
// Function for handling refunds
function handleRefund(type, status, order_status, order_details, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (type === "create" ||
            order_status === "refund" ||
            order_status === "canceled" ||
            order_status === "returned") {
            return;
        }
        const productUpdates = order_details.product_details.map((_a) => __awaiter(this, [_a], void 0, function* ({ product_id, quantity }) {
            return productModel_1.default.findOneAndUpdate({ _id: product_id }, { $inc: { total_quantity: quantity } }, // Restore total_quantity
            { new: true });
        }));
        yield Promise.all(productUpdates);
        console.log(`Order canceled by user ${user_id}`);
    });
}
// Function for handling returns
function handleReturn(type, status, order_status, order_details, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (type === "create" ||
            order_status === "refund" ||
            order_status === "canceled" ||
            order_status === "returned") {
            return;
        }
        const productUpdates = order_details.product_details.map((_a) => __awaiter(this, [_a], void 0, function* ({ product_id, quantity }) {
            return productModel_1.default.findOneAndUpdate({ _id: product_id }, { $inc: { total_quantity: quantity } }, // Restore total_quantity
            { new: true });
        }));
        yield Promise.all(productUpdates);
        console.log(`Order returned by user ${user_id}`);
    });
}
// Function for handling hold orders
function handleHold(order_status, order_details, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        // Simply hold the order and prevent further changes
        console.log(`Order placed on hold by user ${user_id}`);
    });
}
