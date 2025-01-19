import { Router } from "express";
import upload from "../../../middlewares/multer";
import { authorizeRoles, isAuthenticatedUser } from "../../../middlewares/auth";
import ExpenseController from "../controllers/expenseController";

const expenseRoutes = (expenseController: ExpenseController) => {
  const router = Router();
  router.post(
    "/add",
    upload.array("images", 10),
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    expenseController.add_new.bind(expenseController)
  );
  router.post(
    "/update",
    upload.array("images", 10),
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),

    expenseController.update.bind(expenseController)
  );
  router.get(
    "/all-expense",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),

    expenseController.all.bind(expenseController)
  );
  router.get(
    "/data/:id",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),

    expenseController.get_single_data.bind(expenseController)
  );
  router.post(
    "/remove/:id",
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    expenseController.remove.bind(expenseController)
  );

  return router;
};
export default expenseRoutes;
