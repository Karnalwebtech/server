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
class VendorService {
    constructor(vendorRepository) {
        this.vendorRepository = vendorRepository;
    }
    add_new_vendor(vendordata, user_id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (vendordata.email) {
                const existing_email = yield this.vendorRepository.findByEmail(vendordata.email);
                if (existing_email)
                    return next(new ErrorHandler_1.default("Vendor with this Email already exists", 400));
            }
            if (vendordata.gstin) {
                const existing_gstin = yield this.vendorRepository.findByGstin(vendordata.gstin);
                if (vendordata.gstin.length !== 15) {
                    return next(new ErrorHandler_1.default("GSTIN must be 15 characters long", 400));
                }
                if (existing_gstin) {
                    return next(new ErrorHandler_1.default("Vendor with this Gstin already exists", 400));
                }
            }
            return yield this.vendorRepository.createVendor(vendordata, user_id);
        });
    }
    update_details(vendordata, user_id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_exist = yield this.vendorRepository.find_by_vendor_id(vendordata.id, next);
            if (!id_exist) {
                return next(new ErrorHandler_1.default("Vendor ID does not exist", 400));
            }
            if (vendordata.email) {
                const existing_email = yield this.vendorRepository.findByEmail(vendordata.email);
                if (existing_email && existing_email.email !== id_exist.email) {
                    return next(new ErrorHandler_1.default("Vendor with this Email already exists", 400));
                }
            }
            if (vendordata.gstin) {
                const existingVendorWithSameGstin = yield this.vendorRepository.findByGstin(vendordata.gstin);
                if (existingVendorWithSameGstin &&
                    existingVendorWithSameGstin.gstin !== id_exist.gstin) {
                    return next(new ErrorHandler_1.default("Vendor with this GSTIN already exists", 400));
                }
            }
            // if (
            //   isNaN(vendordata.pin_code) ||
            //   vendordata.pin_code < 100000 ||
            //   vendordata.pin_code > 999999
            // ) {
            //   return next(
            //     new ErrorHandler("Pincode must be a valid 6-digit number.", 400)
            //   );
            // }
            return yield this.vendorRepository.update_vendor(vendordata, user_id);
        });
    }
    all_vendors(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.vendorRepository.all_vendors(query);
        });
    }
    data_counter(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.vendorRepository.data_counter(query);
        });
    }
    find_by_vendor_id_and_update(id, data, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.vendorRepository.find_by_vendor_id_and_update(id, data, next);
        });
    }
    find_by_vendor_id(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.vendorRepository.find_by_vendor_id(id, next);
        });
    }
}
exports.default = VendorService;
