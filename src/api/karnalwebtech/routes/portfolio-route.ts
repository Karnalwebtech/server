import { Router } from "express";
import upload from "../../../middlewares/multer";
import { authorizeRoles, isAuthenticatedUser } from "../../../middlewares/auth";
import PortfolioController from "../controllers/portfolio-controller";

const portfolioRoutes = (portfolioController: PortfolioController) => {
  const router = Router();
  router.post(
    "/add",
    upload.array("images", 10),
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    portfolioController.create.bind(portfolioController)
  );
  router.get(
    "/",
    // isAuthenticatedUser,
    // authorizeRoles("admin", "employee"),
    portfolioController.all.bind(portfolioController)
  );
  router.get(
    "/data/:id",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    portfolioController.get_single_data.bind(portfolioController)
  );
  router.delete(
    "/data/:id",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    portfolioController.removeItem.bind(portfolioController)
  );
  router.put(
    "/update",
    upload.array("images", 10),
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    portfolioController.update.bind(portfolioController)
  );
  return router;
};
export default portfolioRoutes;
