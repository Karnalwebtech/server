"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../middlewares/auth");
const customerRoutes = (customerController) => {
    const router = (0, express_1.Router)();
    router.post("/add", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), customerController.add_new_customer.bind(customerController)); // Defining vendor route
    router.post("/update", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), customerController.update_details.bind(customerController)); // Defining vendor route
    router.get("/all-customers", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), customerController.all_customers.bind(customerController)); // Defining vendor route
    router.post("/remove/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), customerController.removeCustomer.bind(customerController));
    router.get("/data/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "employee"), customerController.get_customer.bind(customerController));
    return router; // Return router so it can be used in app.ts
};
exports.default = customerRoutes;
