"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../middlewares/auth");
const userRoutes = (userController) => {
    const router = (0, express_1.Router)();
    router.post("/register", userController.register.bind(userController));
    router.get("/profile", auth_1.isAuthenticatedUser, userController.profile.bind(userController));
    router.post("/action-status/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), userController.status_update.bind(userController));
    router.post("/logout", userController.logout.bind(userController));
    router.post("/login", userController.login.bind(userController));
    router.get("/all", userController.getAllUsers.bind(userController));
    router.get("/:id", userController.getUserById.bind(userController));
    router.put("/:id", userController.updateUser.bind(userController));
    router.delete("/:id", userController.deleteUser.bind(userController));
    return router;
};
exports.default = userRoutes;
