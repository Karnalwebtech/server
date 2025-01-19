import { Router } from "express";
import upload from "../../../middlewares/multer";
import { authorizeRoles, isAuthenticatedUser } from "../../../middlewares/auth";
import PurchasesController from "../controllers/purchasesController";

const purchaseRoutes = (purchasesController: PurchasesController) => {
  const router = Router();
  router.post(
    "/add",
    upload.fields([
      { name: "image", maxCount: 10 }, // Field "images" with up to 10 files
      { name: "invoice", maxCount: 5 }, // Field "invoices" with up to 5 files
      { name: "doket", maxCount: 3 }, // Field "documents" with up to 3 files
    ]),
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    purchasesController.add_new.bind(purchasesController)
  );
  router.post(
    "/update",
    upload.fields([
      { name: "image", maxCount: 10 }, // Field "images" with up to 10 files
      { name: "invoice", maxCount: 5 }, // Field "invoices" with up to 5 files
      { name: "doket", maxCount: 3 }, // Field "documents" with up to 3 files
    ]),
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    purchasesController.update.bind(purchasesController)
  );
  router.get(
    "/all-purchase",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    purchasesController.all.bind(purchasesController)
  );
  router.get(
    "/data/:id",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    purchasesController.get_single_data.bind(purchasesController)
  );
  // router.post(
  //   "/remove/:id",
  //   isAuthenticatedUser,
  // authorizeRoles("admin", "employee"),
  //   productController.remove.bind(productController)
  // );

  return router;
};
export default purchaseRoutes;
