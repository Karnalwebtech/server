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
const ErrorHandler_1 = __importDefault(require("../../utils/ErrorHandler"));
const orderDetails_1 = __importDefault(require("../../models/primary/orderDetails"));
class OrderDetailsRepository {
    create(data, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const toNumber = (value) => (isNaN(Number(value)) ? 0 : Number(value));
            const counter = yield orderDetails_1.default.countDocuments();
            const updated_data = data.map((item) => {
                // Check if item.product exists, otherwise default to an empty object
                const product = item.product || item; // fallback to item itself if product is not defined
                return {
                    product_id: product._id ? product._id : product.product_id,
                    name: product.name || "",
                    selling_price: product.selling_price || 0,
                    primary_unit: product.primary_unit || "",
                    tax: product.tax || "0",
                    purchase_price: product.purchase_price || 0,
                    quantity: toNumber(item.quantity),
                };
            });
            try {
                const newOrderDetails = new orderDetails_1.default({
                    _no: counter + 1,
                    product_details: updated_data, // Wrap in `product_details`
                });
                return yield newOrderDetails.save();
            }
            catch (error) {
                return next(new ErrorHandler_1.default(error, 404));
            }
        });
    }
}
exports.default = OrderDetailsRepository;
