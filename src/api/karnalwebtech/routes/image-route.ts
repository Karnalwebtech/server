import { Router } from "express";
import ImageController from "../controllers/image-controller";
import upload from "../../../middlewares/multer";
import PostService from "../../../utils/comman-repositories/get-single-fields";
import { authorizeRoles, isAuthenticatedUser } from "../../../middlewares/auth";

const imageRoutes = (imageController: ImageController) => {
  const router = Router();
  router.get(
    "/",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    imageController.all.bind(imageController)
  );
  router.get("/image-url", PostService.getImageUrls);

  router.get(
    "/:id",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    imageController.get_single_data.bind(imageController)
  );
  router.put(
    "/update",
    isAuthenticatedUser,
    upload.array("images", 10),
    authorizeRoles("admin", "employee"),
    imageController.update.bind(imageController)
  );

  return router;
};
export default imageRoutes;
