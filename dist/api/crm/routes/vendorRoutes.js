"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../middlewares/auth");
const vendorRoutes = (vendorController) => {
    const router = (0, express_1.Router)();
    router.post("/add", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), vendorController.add_new.bind(vendorController)); // Defining vendor route
    router.post("/update", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), vendorController.update_details.bind(vendorController)); // Defining vendor route
    router.get("/all-vendors", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), vendorController.all_vendors.bind(vendorController)); // Defining vendor route
    router.post("/remove/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), vendorController.removeVendor.bind(vendorController));
    router.get("/data/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), vendorController.get_vendor.bind(vendorController));
    return router; // Return router so it can be used in app.ts
};
exports.default = vendorRoutes;
