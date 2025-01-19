"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../../../middlewares/multer"));
const auth_1 = require("../../../middlewares/auth");
const get_single_fields_1 = __importDefault(require("../../../utils/comman-repositories/get-single-fields"));
const categorieRoutes = (postCategorieConroller) => {
    const router = (0, express_1.Router)();
    router.post("/add", multer_1.default.array("images", 10), auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), postCategorieConroller.create.bind(postCategorieConroller));
    router.get("/", 
    // isAuthenticatedUser,
    // authorizeRoles("admin", "employee"),
    postCategorieConroller.all.bind(postCategorieConroller));
    router.get("/categorie-urls", get_single_fields_1.default.getCategorieUrls);
    router.get("/data/:id", 
    // isAuthenticatedUser,
    // authorizeRoles("admin", "employee"),
    postCategorieConroller.get_single_data.bind(postCategorieConroller));
    router.get("/shop/:slug", 
    // isAuthenticatedUser,
    // authorizeRoles("admin", "employee"),
    postCategorieConroller.get_single_data.bind(postCategorieConroller));
    router.delete("/data/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), postCategorieConroller.removeItem.bind(postCategorieConroller));
    router.put("/update", multer_1.default.array("images", 10), auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), postCategorieConroller.update.bind(postCategorieConroller));
    return router;
};
exports.default = categorieRoutes;
