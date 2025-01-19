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
const auditLogModel_1 = __importDefault(require("../../models/primary/auditLogModel")); // Adjust the path as necessary
class AuditLogger {
    // Method to create a new audit log entry
    logUpdate(userId, // Make sure this is of type ObjectId
    updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const counter = yield auditLogModel_1.default.countDocuments();
            // Specify the return type
            const newAuditLog = new auditLogModel_1.default({
                _no: counter + 1,
                userId,
                updateLogs: [
                    {
                        updatedBy: userId,
                        updatedFields: updatedData,
                        timestamp: new Date(),
                    },
                ],
            });
            const savedAuditLog = yield newAuditLog.save();
            return savedAuditLog._id; // Now this should be recognized as ObjectId
        });
    }
    // Method to find a log by ID
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield auditLogModel_1.default.findOne({ _id: id });
        });
    }
}
exports.default = AuditLogger;
