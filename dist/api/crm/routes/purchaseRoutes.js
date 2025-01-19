"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../../../middlewares/multer"));
const auth_1 = require("../../../middlewares/auth");
const purchaseRoutes = (purchasesController) => {
    const router = (0, express_1.Router)();
    router.post("/add", multer_1.default.fields([
        { name: "image", maxCount: 10 }, // Field "images" with up to 10 files
        { name: "invoice", maxCount: 5 }, // Field "invoices" with up to 5 files
        { name: "doket", maxCount: 3 }, // Field "documents" with up to 3 files
    ]), auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), purchasesController.add_new.bind(purchasesController));
    router.post("/update", multer_1.default.fields([
        { name: "image", maxCount: 10 }, // Field "images" with up to 10 files
        { name: "invoice", maxCount: 5 }, // Field "invoices" with up to 5 files
        { name: "doket", maxCount: 3 }, // Field "documents" with up to 3 files
    ]), auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), purchasesController.update.bind(purchasesController));
    router.get("/all-purchase", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), purchasesController.all.bind(purchasesController));
    router.get("/data/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), purchasesController.get_single_data.bind(purchasesController));
    // router.post(
    //   "/remove/:id",
    //   isAuthenticatedUser,
    // authorizeRoles("admin", "employee"),
    //   productController.remove.bind(productController)
    // );
    return router;
};
exports.default = purchaseRoutes;
