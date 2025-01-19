import { Router } from "express";
import VendorController from "../controllers/vendorController";
import { authorizeRoles, isAuthenticatedUser } from "../../../middlewares/auth";

const vendorRoutes = (vendorController: VendorController) => {
  const router = Router();
  router.post(
    "/add",
    isAuthenticatedUser,
  authorizeRoles("admin", "employee"),
    vendorController.add_new.bind(vendorController)
  ); // Defining vendor route
  router.post(
    "/update",
    isAuthenticatedUser,
  authorizeRoles("admin", "employee"),
    vendorController.update_details.bind(vendorController)
  ); // Defining vendor route
  router.get(
    "/all-vendors",
    isAuthenticatedUser,
  authorizeRoles("admin", "employee"),
    vendorController.all_vendors.bind(vendorController)
  ); // Defining vendor route
  router.post(
    "/remove/:id",
    isAuthenticatedUser,
  authorizeRoles("admin", "employee"),
    vendorController.removeVendor.bind(vendorController)
  );
  router.get(
    "/data/:id",
    isAuthenticatedUser,
  authorizeRoles("admin", "employee"),
    vendorController.get_vendor.bind(vendorController)
  );

  return router; // Return router so it can be used in app.ts
};

export default vendorRoutes;
