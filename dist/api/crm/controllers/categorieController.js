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
class CategorieController {
    constructor(categorieService) {
        this.categorieService = categorieService;
        this.add_new_customer = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user._id;
            const files = req.files;
            if (!user) {
                return next(new ErrorHandler_1.default("User not authenticated", 401));
            }
            const categorie = yield this.categorieService.add_new_category(req.body, files, user, next);
            if (categorie) {
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
            const categorie = yield this.categorieService.update(req.body, files, user, next);
            if (categorie) {
                return res.status(201).json({
                    success: true,
                });
            }
        }));
        this.all_categorie = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const resultPerpage = Number(query.rowsPerPage);
            console.log(query);
            const categorie = yield this.categorieService.all_categorie(query);
            const data_counter = yield this.categorieService.data_counter(query);
            if (categorie) {
                return res.status(201).json({
                    success: true,
                    categorie,
                    resultPerpage,
                    data_counter,
                });
            }
        }));
        this.get_single_data = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const categorie = yield this.categorieService.find_by_id(id, next);
            if (categorie) {
                return res.status(201).json({
                    success: true,
                    categorie,
                });
            }
        }));
        this.remove = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = req.body;
            console.log(data);
            const categorie = yield this.categorieService.find_by_id_and_update(id, data, next);
            if (categorie) {
                return res.status(200).json({
                    succes: true,
                });
            }
        }));
    }
}
exports.default = CategorieController;
