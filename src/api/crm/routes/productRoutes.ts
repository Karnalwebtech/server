import { Router } from "express";
import upload from "../../../middlewares/multer";
import { authorizeRoles, isAuthenticatedUser } from "../../../middlewares/auth";
import ProductController from "../controllers/productController";

const productRoutes = (productController: ProductController) => {
  const router = Router();
  router.post(
    "/add",
    upload.array("images", 10),
    isAuthenticatedUser,
  authorizeRoles("admin", "employee"),
    productController.add_new_product.bind(productController)
  );
  router.post(
    "/update",
    upload.array("images", 10),
    isAuthenticatedUser,
  authorizeRoles("admin", "employee"),
    productController.update.bind(productController)
  );
  router.get(
    "/all-products",
    isAuthenticatedUser,
  authorizeRoles("admin", "employee"),
    productController.all.bind(productController)
  );
  router.get(
    "/data/:id",
    isAuthenticatedUser,
  authorizeRoles("admin", "employee"),
    productController.get_single_data.bind(productController)
  );
  router.post(
    "/remove/:id",
    isAuthenticatedUser,
  authorizeRoles("admin", "employee"),
    productController.remove.bind(productController)
  );

  return router;
};
export default productRoutes;
