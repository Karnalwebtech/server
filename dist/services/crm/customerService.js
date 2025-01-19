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
class CustomerService {
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    add_new_customer(data, user_id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.gstin) {
                const existing_email = yield this.customerRepository.findByEmail(data.email);
                if (existing_email) {
                    return next(new ErrorHandler_1.default("Customer with this Email already exists", 400));
                }
            }
            if (data.gstin) {
                const existing_gstin = yield this.customerRepository.findByGstin(data.gstin);
                if (existing_gstin) {
                    return next(new ErrorHandler_1.default("Customer with this Gstin already exists", 400));
                }
            }
            return yield this.customerRepository.createCustomer(data, user_id);
        });
    }
    update_details(data, user_id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_exist = yield this.customerRepository.find_by_id(data.id, next);
            if (!id_exist) {
                return next(new ErrorHandler_1.default("Customer ID does not exist", 400));
            }
            if (data.email) {
                const existing_email = yield this.customerRepository.findByEmail(data.email);
                if (existing_email && existing_email.email !== id_exist.email) {
                    return next(new ErrorHandler_1.default("Customer with this Email already exists", 400));
                }
            }
            if (data.gstin) {
                const existingWithSameGstin = yield this.customerRepository.findByGstin(data.gstin);
                if (existingWithSameGstin &&
                    existingWithSameGstin.gstin !== id_exist.gstin) {
                    return next(new ErrorHandler_1.default("Customer with this GSTIN already exists", 400));
                }
            }
            return yield this.customerRepository.update_customer(data, user_id);
        });
    }
    all_customers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.customerRepository.all_customers(query);
        });
    }
    data_counter(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.customerRepository.data_counter(query);
        });
    }
    find_by_id_and_update(id, data, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.customerRepository.find_by_id_and_update(id, data, next);
        });
    }
    find_by_id(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.customerRepository.find_by_id(id, next);
        });
    }
}
exports.default = CustomerService;
