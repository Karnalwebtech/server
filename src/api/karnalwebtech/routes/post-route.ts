import { Router } from "express";
import upload from "../../../middlewares/multer";
import { authorizeRoles, isAuthenticatedUser } from "../../../middlewares/auth";
import PostController from "../controllers/post-controller";
import PostService from "../../../utils/comman-repositories/get-single-fields";

const postRoutes = (postController: PostController) => {
  const router = Router();
  router.post(
    "/add",
    upload.array("images", 10),
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    postController.create.bind(postController)
  );
  router.get(
    "/",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    postController.all.bind(postController)
  );
  router.get("/post-urls", PostService.getPostUrls);
  router.get(
    "/data/:id",
    // isAuthenticatedUser,
    // authorizeRoles("admin", "employee"),
    postController.get_single_data.bind(postController)
  );
  router.delete(
    "/data/:id",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    postController.removeItem.bind(postController)
  );
  router.put(
    "/update",
    upload.array("images", 10),
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    postController.update.bind(postController)
  );
  //--------------------- store
  router.get(
    "/blog/:slug",
    // isAuthenticatedUser,
    // authorizeRoles("admin", "employee"),
    postController.get_single_data.bind(postController)
  );
  router.get("/store", postController.all.bind(postController));
  return router;
};
export default postRoutes;
