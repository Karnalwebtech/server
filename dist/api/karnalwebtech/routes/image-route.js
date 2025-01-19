"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../../../middlewares/multer"));
const get_single_fields_1 = __importDefault(require("../../../utils/comman-repositories/get-single-fields"));
const auth_1 = require("../../../middlewares/auth");
const imageRoutes = (imageController) => {
    const router = (0, express_1.Router)();
    router.get("/", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), imageController.all.bind(imageController));
    router.get("/image-url", get_single_fields_1.default.getImageUrls);
    router.get("/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), imageController.get_single_data.bind(imageController));
    router.put("/update", auth_1.isAuthenticatedUser, multer_1.default.array("images", 10), (0, auth_1.authorizeRoles)("admin", "employee"), imageController.update.bind(imageController));
    return router;
};
exports.default = imageRoutes;
