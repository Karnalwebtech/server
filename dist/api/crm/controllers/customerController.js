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
const AsyncHandler_1 = __importDefault(require("../../../middlewares/AsyncHandler"));
const ErrorHandler_1 = __importDefault(require("../../../utils/ErrorHandler"));
class CustomerController {
    constructor(customerService) {
        this.customerService = customerService;
        this.add_new_customer = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user._id;
            if (!user) {
                return next(new ErrorHandler_1.default("User not authenticated", 401));
            }
            const customer = yield this.customerService.add_new_customer(req.body, user, next);
            if (customer) {
                return res.status(201).json({
                    success: true,
                });
            }
        }));
        this.update_details = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user._id;
            const customer = yield this.customerService.update_details(req.body, user, next);
            if (customer) {
                return res.status(201).json({
                    success: true,
                });
            }
        }));
        this.all_customers = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const resultPerpage = Number(query.rowsPerPage);
            const customer = yield this.customerService.all_customers(query);
            const data_counter = yield this.customerService.data_counter(query);
            if (customer) {
                return res.status(201).json({
                    success: true,
                    customer,
                    resultPerpage,
                    data_counter,
                });
            }
        }));
        this.get_customer = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const customer = yield this.customerService.find_by_id(id, next);
            if (customer) {
                return res.status(201).json({
                    success: true,
                    customer
                });
            }
        }));
        this.removeCustomer = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = req.body;
            console.log(data);
            const customer = yield this.customerService.find_by_id_and_update(id, data, next);
            if (customer) {
                return res.status(200).json({
                    succes: true,
                });
            }
        }));
    }
}
exports.default = CustomerController;
