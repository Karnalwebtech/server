import { Router } from "express";
import upload from "../../../middlewares/multer";
import { authorizeRoles, isAuthenticatedUser } from "../../../middlewares/auth";
import TagController from "../controllers/tag-controller";

const tagRoutes = (tagController: TagController) => {
  const router = Router();
  router.post(
    "/add",
    upload.array("images", 10),
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    tagController.create.bind(tagController)
  );
  router.get(
    "/",
    // isAuthenticatedUser,
    // authorizeRoles("admin", "employee"),
    tagController.all.bind(tagController)
  );
  router.get(
    "/data/:id",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    tagController.get_single_data.bind(tagController)
  );
  router.delete(
    "/data/:id",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    tagController.removeItem.bind(tagController)
  );
  router.put(
    "/update",
    upload.array("images", 10),
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    tagController.update.bind(tagController)
  );
  return router;
};
export default tagRoutes;
