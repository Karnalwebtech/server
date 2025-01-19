import { Router } from "express";
import upload from "../../../middlewares/multer";
import { authorizeRoles, isAuthenticatedUser } from "../../../middlewares/auth";
import OrderController from "../controllers/orderController";

const orderRoutes = (orderController: OrderController) => {
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
    orderController.add_new.bind(orderController)
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
    orderController.update.bind(orderController)
  );
  router.get(
    "/all-orders",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    orderController.all.bind(orderController)
  );
  router.get(
    "/data/:id",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    orderController.get_single_data.bind(orderController)
  );
  // router.post(
  //   "/remove/:id",
  //   isAuthenticatedUser,
  // authorizeRoles("admin", "employee"),
  //   productController.remove.bind(productController)
  // );

  return router;
};
export default orderRoutes;
