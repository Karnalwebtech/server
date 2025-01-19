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
const userModel_1 = __importDefault(require("../../models/primary/userModel"));
const apiFeatuers_1 = __importDefault(require("../../utils/apiFeatuers"));
const generateRandomId_1 = require("../../utils/generateRandomId");
const ErrorHandler_1 = __importDefault(require("../../utils/ErrorHandler"));
class UserRepository {
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, name, uuid } = userData;
            const rendom_id = (0, generateRandomId_1.generateRandomId)();
            const counter = yield userModel_1.default.countDocuments();
            const data = {
                _no: counter + 1,
                user_id: `user_${rendom_id}_${uuid}`,
                email,
                password,
                name,
            };
            const user = new userModel_1.default(data);
            return yield user.save();
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findOne({ email });
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findById(id);
        });
    }
    getAllUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultPerPage = Number(query.rowsPerPage);
            const apiFeatures = new apiFeatuers_1.default(userModel_1.default.find(), query);
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
            const apiFeatures = new apiFeatuers_1.default(userModel_1.default.find(), query);
            apiFeatures.search().filter();
            const result = yield apiFeatures.exec();
            return result.length;
        });
    }
    updateUser(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            }).select("-password");
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findByIdAndDelete(id);
        });
    }
    status_update(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existuser = yield userModel_1.default.findById(id);
                if (!existuser) {
                    return next(new ErrorHandler_1.default("user not fount", 404));
                }
                const updated_data = {
                    isActive: !existuser.isActive,
                };
                const updated_custome_data = yield userModel_1.default.findByIdAndUpdate(id, updated_data, {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false,
                });
                if (!updated_custome_data) {
                    return next(new ErrorHandler_1.default("User not found", 404));
                }
                return updated_custome_data;
            }
            catch (error) {
                return next(new ErrorHandler_1.default(error, 404));
            }
        });
    }
}
exports.default = UserRepository;
