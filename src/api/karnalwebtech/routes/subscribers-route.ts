import { Router } from "express";
import upload from "../../../middlewares/multer";
import { authorizeRoles, isAuthenticatedUser } from "../../../middlewares/auth";
import SubscribersController from "../controllers/subscribers-controller";

const subscribersRoutes = (subscribersController: SubscribersController) => {
  const router = Router();
  router.post(
    "/add",
    upload.array("images", 0),
    subscribersController.create.bind(subscribersController)
  );
  router.get("/", subscribersController.all.bind(subscribersController));
  router.get(
    "/data/:id",
    subscribersController.get_single_data.bind(subscribersController)
  );
  router.delete(
    "/data/:id",
    subscribersController.removeItem.bind(subscribersController)
  );
  return router;
};
export default subscribersRoutes;
