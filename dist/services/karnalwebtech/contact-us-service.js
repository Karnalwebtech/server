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
class ContactUsService {
    constructor(cortfoliotRepository) {
        this.cortfoliotRepository = cortfoliotRepository;
    }
    create(data, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, email } = data;
            if (name === "" || description === "" || email === "") {
                next(new ErrorHandler_1.default("All fields are required", 400));
            }
            try {
                return yield this.cortfoliotRepository.create(data, next);
            }
            catch (error) {
                next(new ErrorHandler_1.default(error.message || "Internal Server Error", 500));
            }
        });
    }
    update(data, user_id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.cortfoliotRepository.update(data, user_id, next);
            }
            catch (error) {
                next(new ErrorHandler_1.default(error.message || "Internal Server Error", 500));
            }
        });
    }
    all(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.cortfoliotRepository.all(query);
        });
    }
    data_counter(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.cortfoliotRepository.data_counter(query);
        });
    }
    find_by_id(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.cortfoliotRepository.find_by_id(id, next);
        });
    }
    findBYpageid(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.cortfoliotRepository.findBYpageid(id, next);
        });
    }
    removeItem(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.cortfoliotRepository.removeItem(id, next);
        });
    }
}
exports.default = ContactUsService;
