import { Router } from "express";
import CategorieController from "../controllers/categorieController";
import upload from "../../../middlewares/multer";
import { authorizeRoles, isAuthenticatedUser } from "../../../middlewares/auth";

const categorieRoutes = (categorieController: CategorieController) => {
  const router = Router();
  router.post(
    "/add",
    upload.array("images", 10),
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    categorieController.add_new_customer.bind(categorieController)
  );
  router.post(
    "/update",
    upload.array("images", 10),
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),

    categorieController.update.bind(categorieController)
  );
  router.get(
    "/all-categorie",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),

    categorieController.all_categorie.bind(categorieController)
  );
  router.get(
    "/data/:id",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),

    categorieController.get_single_data.bind(categorieController)
  );
  router.post(
    "/remove/:id",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),

    categorieController.remove.bind(categorieController)
  );

  return router;
};
export default categorieRoutes;
