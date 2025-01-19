"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../../../middlewares/multer"));
const auth_1 = require("../../../middlewares/auth");
const orderRoutes = (orderController) => {
    const router = (0, express_1.Router)();
    router.post("/add", multer_1.default.fields([
        { name: "image", maxCount: 10 }, // Field "images" with up to 10 files
        { name: "invoice", maxCount: 5 }, // Field "invoices" with up to 5 files
        { name: "doket", maxCount: 3 }, // Field "documents" with up to 3 files
    ]), auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), orderController.add_new.bind(orderController));
    router.post("/update", multer_1.default.fields([
        { name: "image", maxCount: 10 }, // Field "images" with up to 10 files
        { name: "invoice", maxCount: 5 }, // Field "invoices" with up to 5 files
        { name: "doket", maxCount: 3 }, // Field "documents" with up to 3 files
    ]), auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), orderController.update.bind(orderController));
    router.get("/all-orders", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), orderController.all.bind(orderController));
    router.get("/data/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), orderController.get_single_data.bind(orderController));
    // router.post(
    //   "/remove/:id",
    //   isAuthenticatedUser,
    // authorizeRoles("admin", "employee"),
    //   productController.remove.bind(productController)
    // );
    return router;
};
exports.default = orderRoutes;
