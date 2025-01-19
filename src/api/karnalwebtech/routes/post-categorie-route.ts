import { Router } from "express";
import upload from "../../../middlewares/multer";
import CategorieController from "../controllers/post-categorie-controller";
import { authorizeRoles, isAuthenticatedUser } from "../../../middlewares/auth";
import PostService from "../../../utils/comman-repositories/get-single-fields";

const categorieRoutes = (postCategorieConroller: CategorieController) => {
  const router = Router();
  router.post(
    "/add",
    upload.array("images", 10),
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    postCategorieConroller.create.bind(postCategorieConroller)
  );
  router.get(
    "/",
    // isAuthenticatedUser,
    // authorizeRoles("admin", "employee"),
    postCategorieConroller.all.bind(postCategorieConroller)
  );
  router.get("/categorie-urls", PostService.getCategorieUrls);

  router.get(
    "/data/:id",
    // isAuthenticatedUser,
    // authorizeRoles("admin", "employee"),
    postCategorieConroller.get_single_data.bind(postCategorieConroller)
  );
  router.get(
    "/shop/:slug",
    // isAuthenticatedUser,
    // authorizeRoles("admin", "employee"),
    postCategorieConroller.get_single_data.bind(postCategorieConroller)
  );
  router.delete(
    "/data/:id",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    postCategorieConroller.removeItem.bind(postCategorieConroller)
  );
  router.put(
    "/update",
    upload.array("images", 10),
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    postCategorieConroller.update.bind(postCategorieConroller)
  );
  return router;
};
export default categorieRoutes;
