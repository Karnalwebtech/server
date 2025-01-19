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
const addressModel_1 = __importDefault(require("../../models/primary/addressModel"));
const customerModel_1 = __importDefault(require("../../models/primary/customerModel"));
const apiFeatuers_1 = __importDefault(require("../../utils/apiFeatuers"));
const ErrorHandler_1 = __importDefault(require("../../utils/ErrorHandler"));
const generateRandomId_1 = require("../../utils/generateRandomId");
class CustomerRepository {
    createCustomer(data, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rendom_id = (0, generateRandomId_1.generateRandomId)();
            const { shipping_address, billing_address, status, name, phone, email, company, gstin, uuid, } = data;
            // Add audit_log to both shipping and billing addresses
            const shipping_data = Object.assign(Object.assign({}, shipping_address), { audit_log: user_id });
            const billing_data = Object.assign(Object.assign({}, billing_address), { audit_log: user_id });
            // Create billing and shipping addresses concurrently
            const [billing_a, shipping_a] = yield Promise.all([
                addressModel_1.default.create(billing_data),
                addressModel_1.default.create(shipping_data),
            ]);
            const counter = yield customerModel_1.default.countDocuments();
            // Create vendor data object
            const updated_data = {
                _no: counter + 1,
                customer_id: `customer_${uuid}_${rendom_id}`,
                name: name,
                phone,
                email,
                company_name: company,
                gstin,
                billing_address: billing_a,
                shipping_address: shipping_a,
                status,
                audit_log: user_id,
            };
            // Save the vendor and return the result
            const customer_data = new customerModel_1.default(updated_data);
            return yield customer_data.save();
        });
    }
    findByGstin(gstin) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield customerModel_1.default.findOne({ gstin });
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield customerModel_1.default.findOne({ email });
        });
    }
    update_customer(data, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, phone, email, company, gstin, billing_address, status, shipping_address, } = data;
            // Prepare the updated vendor data
            const updated_data = {
                name: name,
                phone: phone,
                email: email,
                company_name: company,
                gstin: gstin,
                status,
                audit_log: user_id,
            };
            const updated_custome_data = yield customerModel_1.default.findByIdAndUpdate(data.id, updated_data, {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            });
            if (!updated_custome_data) {
                throw new Error("Customer not found");
            }
            // Prepare data for billing and shipping addresses with audit_log
            const shipping_data = Object.assign(Object.assign({}, shipping_address), { audit_log: user_id });
            const billing_data = Object.assign(Object.assign({}, billing_address), { audit_log: user_id });
            // Update billing and shipping addresses in parallel if they exist
            const updateAddressPromises = [];
            if (updated_custome_data.billing_address) {
                updateAddressPromises.push(addressModel_1.default.findByIdAndUpdate(updated_custome_data.billing_address, billing_data, {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false,
                }));
            }
            if (updated_custome_data.shipping_address) {
                updateAddressPromises.push(addressModel_1.default.findByIdAndUpdate(updated_custome_data.shipping_address, shipping_data, {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false,
                }));
            }
            // Wait for all address updates to complete
            yield Promise.all(updateAddressPromises);
            return updated_custome_data;
        });
    }
    all_customers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultPerPage = Number(query.rowsPerPage);
            const apiFeatures = new apiFeatuers_1.default(customerModel_1.default.find(), query);
            apiFeatures.search().filter().sort().pagination(resultPerPage);
            const result = yield apiFeatures
                .getQuery() // Use the public getter
                .populate([
                {
                    path: "audit_log",
                    model: "User",
                },
                {
                    path: "shipping_address",
                    model: "Address",
                },
                {
                    path: "billing_address",
                    model: "Address",
                },
            ])
                .sort({ updated_at: -1 })
                .exec();
            return result;
        });
    }
    data_counter(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiFeatures = new apiFeatuers_1.default(customerModel_1.default.find(), query);
            apiFeatures.search().filter();
            const result = yield apiFeatures.exec();
            return result.length;
        });
    }
    find_by_id_and_update(id, data, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const Customer = yield customerModel_1.default.findById(id);
            if (!Customer) {
                return next(new ErrorHandler_1.default(`Customer with ID ${id} not found`, 404));
            }
            Customer.is_active = data.state;
            Customer.is_delete = data.hard_delete;
            yield Customer.save();
            return Customer;
        });
    }
    find_by_id(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield customerModel_1.default.findById(id).populate([
                {
                    path: "audit_log",
                    model: "User",
                },
                {
                    path: "shipping_address",
                    model: "Address",
                },
                {
                    path: "billing_address",
                    model: "Address",
                },
            ]);
            if (!customer) {
                return next(new ErrorHandler_1.default(`Customer with ID ${id} not found`, 404));
            }
            return customer;
        });
    }
}
exports.default = CustomerRepository;
