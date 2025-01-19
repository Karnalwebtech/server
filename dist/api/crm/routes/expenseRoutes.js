"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../../../middlewares/multer"));
const auth_1 = require("../../../middlewares/auth");
const expenseRoutes = (expenseController) => {
    const router = (0, express_1.Router)();
    router.post("/add", multer_1.default.array("images", 10), auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), expenseController.add_new.bind(expenseController));
    router.post("/update", multer_1.default.array("images", 10), auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), expenseController.update.bind(expenseController));
    router.get("/all-expense", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), expenseController.all.bind(expenseController));
    router.get("/data/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), expenseController.get_single_data.bind(expenseController));
    router.post("/remove/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), expenseController.remove.bind(expenseController));
    return router;
};
exports.default = expenseRoutes;
