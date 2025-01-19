"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../../../middlewares/multer"));
const auth_1 = require("../../../middlewares/auth");
const contactUsRoutes = (contactUsController) => {
    const router = (0, express_1.Router)();
    router.post("/add", multer_1.default.array("images", 0), contactUsController.create.bind(contactUsController));
    router.get("/", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), contactUsController.all.bind(contactUsController));
    return router;
};
exports.default = contactUsRoutes;
