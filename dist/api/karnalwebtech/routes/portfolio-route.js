"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../../../middlewares/multer"));
const auth_1 = require("../../../middlewares/auth");
const portfolioRoutes = (portfolioController) => {
    const router = (0, express_1.Router)();
    router.post("/add", multer_1.default.array("images", 10), auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), portfolioController.create.bind(portfolioController));
    router.get("/", 
    // isAuthenticatedUser,
    // authorizeRoles("admin", "employee"),
    portfolioController.all.bind(portfolioController));
    router.get("/data/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), portfolioController.get_single_data.bind(portfolioController));
    router.delete("/data/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), portfolioController.removeItem.bind(portfolioController));
    router.put("/update", multer_1.default.array("images", 10), auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), portfolioController.update.bind(portfolioController));
    return router;
};
exports.default = portfolioRoutes;
