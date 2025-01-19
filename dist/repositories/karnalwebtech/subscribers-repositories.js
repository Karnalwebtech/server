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
const ErrorHandler_1 = __importDefault(require("../../utils/ErrorHandler"));
const generateRandomId_1 = require("../../utils/generateRandomId");
const subscribers_1 = __importDefault(require("../../models/karnalwebtech/subscribers"));
class SubscribersRepository {
    // Reusable function to generate unique post ID
    generatePostId(uuid, randomId, number) {
        return `susb_${randomId.toLowerCase()}_${uuid}${number}`;
    }
    // Reusable function to get the next post number
    getNextNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield subscribers_1.default.countDocuments();
            return count + 1;
        });
    }
    // Helper function for populating category data
    populateData(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return query.populate([{ path: "audit_log", model: userModel_1.default }]);
        });
    }
    // Create a new post
    create(data, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const randomId = (0, generateRandomId_1.generateRandomId)();
                const { uuid, email } = data;
                // Get next post number
                const contactNumber = yield this.getNextNumber();
                // Generate post ID
                const catId = this.generatePostId(uuid, randomId, contactNumber);
                // Prepare data to be saved
                const newData = {
                    _no: contactNumber,
                    email,
                    susb_id: catId,
                };
                const result = new subscribers_1.default(newData);
                return yield result.save();
            }
            catch (error) {
                throw new Error(`Error creating subscribers us: ${error.message}`);
            }
        });
    }
    // Retrieve all post with filters and pagination
    all(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultPerPage = Number(query.rowsPerPage);
            const apiFeatures = new apiFeatuers_1.default(subscribers_1.default.find({ is_delete: { $ne: true } }), query);
            apiFeatures.search().filter().sort().pagination(resultPerPage);
            // Apply population and execute query
            const result = yield apiFeatures
                .getQuery()
                .populate([{ path: "audit_log", model: userModel_1.default }])
                .sort({ updated_at: -1 })
                .exec();
            return result;
        });
    }
    // Get the total count of [pst] based on filters
    data_counter(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiFeatures = new apiFeatuers_1.default(subscribers_1.default.find({ is_delete: { $ne: true } }), query);
            apiFeatures.search().filter();
            const result = yield apiFeatures.exec();
            return result.length;
        });
    }
    // Find portfolio by ID
    find_by_id(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.populateData(subscribers_1.default.findById(id));
            if (!result) {
                return next(new ErrorHandler_1.default(`portfolio with ID ${id} not found`, 404));
            }
            return result;
        });
    }
    // Find by email
    find_by_email(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.populateData(subscribers_1.default.findOne({ email }));
            return result;
        });
    }
    // Find post by page ID
    findBYpageid(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.populateData(subscribers_1.default.findOne({ susb_id: id }));
            if (!result) {
                return next(new ErrorHandler_1.default(`Subscriber with ID ${id} not found`, 404));
            }
            return result;
        });
    }
    removeItem(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.populateData(subscribers_1.default.findOne({ susb_id: id }));
            if (!result) {
                return next(new ErrorHandler_1.default(`Subscriber with ID ${id} not found`, 404));
            }
            result.is_delete = true;
            yield result.save();
            return result;
        });
    }
}
exports.default = SubscribersRepository;
