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
const jwtToken_1 = __importDefault(require("../../../utils/jwtToken"));
class UserController {
    constructor(userService) {
        this.userService = userService;
        this.logout = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const option = {
                expires: new Date(),
                path: "/",
                secure: true, // accessible through HTTP
                httpOnly: true, // only server can access the cookie
                sameSite: "none", // enforcement type
                partitioned: false,
            };
            res.status(200).cookie("token", null, option).json({
                success: true,
            });
        }));
        this.register = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.registerUser(req.body, next);
            res.status(201).json({ succes: true, user });
        }));
        this.profile = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({ succes: true });
        }));
        this.login = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield this.userService.authenticateUser(email, password, next);
            if (!user) {
                return next(new ErrorHandler_1.default("Invalid credentials", 404));
            }
            yield (0, jwtToken_1.default)(user, 200, res);
        }));
        this.getAllUsers = AsyncHandler_1.default.handle((req, res) => __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const resultPerpage = Number(query.rowsPerPage);
            const result = yield this.userService.getAllUsers(query);
            const data_counter = yield this.userService.data_counter(query);
            if (result) {
                return res.status(201).json({
                    success: true,
                    result,
                    resultPerpage,
                    data_counter,
                });
            }
        }));
        this.getUserById = AsyncHandler_1.default.handle((req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.getUserById(req.params.id);
            res.status(200).json({ user });
        }));
        this.updateUser = AsyncHandler_1.default.handle((req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.updateUser(req.params.id, req.body);
            res.status(200).json({ user });
        }));
        this.deleteUser = AsyncHandler_1.default.handle((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.userService.deleteUser(req.params.id);
            res.status(204).send();
        }));
        this.status_update = AsyncHandler_1.default.handle((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                return next(new ErrorHandler_1.default("id not found", 404));
            }
            const result = yield this.userService.status_update(id, next);
            if (result) {
                return res.status(201).json({
                    success: true,
                });
            }
        }));
    }
}
exports.default = UserController;
