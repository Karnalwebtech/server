"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../../../middlewares/multer"));
const auth_1 = require("../../../middlewares/auth");
const productRoutes = (productController) => {
    const router = (0, express_1.Router)();
    router.post("/add", multer_1.default.array("images", 10), auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), productController.add_new_product.bind(productController));
    router.post("/update", multer_1.default.array("images", 10), auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), productController.update.bind(productController));
    router.get("/all-products", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), productController.all.bind(productController));
    router.get("/data/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), productController.get_single_data.bind(productController));
    router.post("/remove/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), productController.remove.bind(productController));
    return router;
};
exports.default = productRoutes;
