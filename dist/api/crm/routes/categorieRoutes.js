"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../../../middlewares/multer"));
const auth_1 = require("../../../middlewares/auth");
const categorieRoutes = (categorieController) => {
    const router = (0, express_1.Router)();
    router.post("/add", multer_1.default.array("images", 10), auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), categorieController.add_new_customer.bind(categorieController));
    router.post("/update", multer_1.default.array("images", 10), auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), categorieController.update.bind(categorieController));
    router.get("/all-categorie", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), categorieController.all_categorie.bind(categorieController));
    router.get("/data/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), categorieController.get_single_data.bind(categorieController));
    router.post("/remove/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), categorieController.remove.bind(categorieController));
    return router;
};
exports.default = categorieRoutes;
