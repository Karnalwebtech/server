import vendorRoutes from "../api/crm/routes/vendorRoutes";
import customerRoutes from "../api/crm/routes/customerRoutes";
import categorieRoutes from "../api/crm/routes/categorieRoutes";
import productRoutes from "../api/crm/routes/productRoutes";
import orderRoutes from "../api/crm/routes/orderRoutes";
import expenseRoutes from "../api/crm/routes/expenseRoutes";
import purchaseRoutes from "../api/crm/routes/purchaseRoutes";
import userRoutes from "../api/crm/routes/userRoutes";

const crm_routesLoader = (app: any, controllers: any) => {
  app.use("/api/auth", userRoutes(controllers.userController));
  app.use("/api/vendor", vendorRoutes(controllers.vendorController));
  app.use("/api/customer", customerRoutes(controllers.customerController));
  app.use("/api/categorie", categorieRoutes(controllers.categorieController));
  app.use("/api/product", productRoutes(controllers.productController));
  app.use("/api/order", orderRoutes(controllers.orderController));
  app.use("/api/expense", expenseRoutes(controllers.expenseController));
  app.use("/api/purchase", purchaseRoutes(controllers.purchasesController));
};

export default crm_routesLoader;