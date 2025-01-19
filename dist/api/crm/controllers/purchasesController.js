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
class PurchasesController {
    constructor(purchasesService) {
        this.purchasesService = purchasesService;
        this.add_new = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user._id;
            const files = req.files;
            if (!user) {
                return next(new ErrorHandler_1.default("User not authenticated", 401));
            }
            const result = yield this.purchasesService.add_new(req.body, files, user, next);
            if (result) {
                return res.status(201).json({
                    success: true,
                });
            }
        }));
        this.update = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user._id;
            const files = req.files;
            if (!user) {
                return next(new ErrorHandler_1.default("User not authenticated", 401));
            }
            const result = yield this.purchasesService.update(req.body, files, user, next);
            // if (result) {
            return res.status(201).json({
                success: true,
            });
            // }
        }));
        this.all = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const resultPerpage = Number(query.rowsPerPage);
            const result = yield this.purchasesService.all(query);
            const data_counter = yield this.purchasesService.data_counter(query);
            if (result) {
                return res.status(201).json({
                    success: true,
                    result,
                    resultPerpage,
                    data_counter,
                });
            }
        }));
        this.get_single_data = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield this.purchasesService.find_by_id(id, next);
            if (result) {
                return res.status(201).json({
                    success: true,
                    result,
                });
            }
        }));
    }
}
exports.default = PurchasesController;
