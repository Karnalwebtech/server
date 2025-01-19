import VendorController from "../../api/crm/controllers/vendorController";
import CustomerController from "../../api/crm/controllers/customerController";
import CategorieController from "../../api/crm/controllers/categorieController";
import ProductController from "../../api/crm/controllers/productController";
import OrderController from "../../api/crm/controllers/orderController";
import ExpenseController from "../../api/crm/controllers/expenseController";
import PurchasesController from "../../api/crm/controllers/purchasesController";
import UserController from "../../api/crm/controllers/userController";

const controllersLoader = (services: any) => {
    const userController = new UserController(services.userService);
    const vendorController = new VendorController(services.vendorService);
    const customerController = new CustomerController(services.customerService);
    const categorieController = new CategorieController(services.categorieService);
    const productController = new ProductController(services.productService);
    const orderController = new OrderController(services.orderService);
    const expenseController = new ExpenseController(services.expenseService);
    const purchasesController = new PurchasesController(services.purchaseService);

  return {
    userController,
    vendorController,
    customerController,
    categorieController,
    productController,
    orderController,
    expenseController,
    purchasesController,
  };
};

export default controllersLoader;
