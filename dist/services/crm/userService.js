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
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    registerUser(userData, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepository.findUserByEmail(userData.email);
            if (existingUser) {
                return next(new ErrorHandler_1.default("User with this email already exists", 400));
            }
            return yield this.userRepository.createUser(userData);
        });
    }
    authenticateUser(email, password, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserByEmail(email);
            if (!user) {
                return next(new ErrorHandler_1.default("Invalid email or password", 400));
            }
            const isMatch = yield user.comparePassword(password);
            if (!isMatch) {
                return next(new ErrorHandler_1.default("Invalid email or password", 400));
            }
            const isActive = user.isActive; // Access isActive only if existingUser is not null
            if (!isActive) {
                return next(new ErrorHandler_1.default(`${user.email} you are not authorized, contact to admin`, 404));
            }
            return user;
        });
    }
    getAllUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.getAllUsers(query);
        });
    }
    data_counter(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.data_counter(query);
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserById(id);
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        });
    }
    updateUser(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.updateUser(id, updateData);
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.deleteUser(id);
        });
    }
    status_update(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.status_update(id, next);
        });
    }
}
exports.default = UserService;
