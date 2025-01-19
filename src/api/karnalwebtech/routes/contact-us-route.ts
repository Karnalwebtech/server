import { Router } from "express";
import upload from "../../../middlewares/multer";
import { authorizeRoles, isAuthenticatedUser } from "../../../middlewares/auth";
import ContactUsController from "../controllers/contact-us-controller";

const contactUsRoutes = (contactUsController: ContactUsController) => {
  const router = Router();
  router.post(
    "/add",
    upload.array("images", 0),
    contactUsController.create.bind(contactUsController)
  );
  router.get(
    "/",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    contactUsController.all.bind(contactUsController)
  );
  return router;
};
export default contactUsRoutes;
