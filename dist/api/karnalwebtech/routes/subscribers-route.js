"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../../../middlewares/multer"));
const subscribersRoutes = (subscribersController) => {
    const router = (0, express_1.Router)();
    router.post("/add", multer_1.default.array("images", 0), subscribersController.create.bind(subscribersController));
    router.get("/", subscribersController.all.bind(subscribersController));
    router.get("/data/:id", subscribersController.get_single_data.bind(subscribersController));
    router.delete("/data/:id", subscribersController.removeItem.bind(subscribersController));
    return router;
};
exports.default = subscribersRoutes;
