"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../../../middlewares/multer"));
const auth_1 = require("../../../middlewares/auth");
const get_single_fields_1 = __importDefault(require("../../../utils/comman-repositories/get-single-fields"));
const postRoutes = (postController) => {
    const router = (0, express_1.Router)();
    router.post("/add", multer_1.default.array("images", 10), auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), postController.create.bind(postController));
    router.get("/", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), postController.all.bind(postController));
    router.get("/post-urls", get_single_fields_1.default.getPostUrls);
    router.get("/data/:id", 
    // isAuthenticatedUser,
    // authorizeRoles("admin", "employee"),
    postController.get_single_data.bind(postController));
    router.delete("/data/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), postController.removeItem.bind(postController));
    router.put("/update", multer_1.default.array("images", 10), auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), postController.update.bind(postController));
    //--------------------- store
    router.get("/blog/:slug", 
    // isAuthenticatedUser,
    // authorizeRoles("admin", "employee"),
    postController.get_single_data.bind(postController));
    router.get("/store", postController.all.bind(postController));
    return router;
};
exports.default = postRoutes;
