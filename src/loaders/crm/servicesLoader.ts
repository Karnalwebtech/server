// src/loaders/servicesLoader.ts
import UserService from "../../services/crm/userService";
import UserRepository from "../../repositories/crm/userRepository";
import VendorRepository from "../../repositories/crm/vendorRepository";
import VendorService from "../../services/crm/vendorService";
import CustomerService from "../../services/crm/customerService";
import CustomerRepository from "../../repositories/crm/customerRepository";
import CategorieService from "../../services/crm/categorieService";
import CategorieRepository from "../../repositories/crm/categorieRepository";
import ProductService from "../../services/crm/productService";
import ProductRepository from "../../repositories/crm/productRepository";
import OrderService from "../../services/crm/orderService";
import OrderRepository from "../../repositories/crm/orderRepository";
import ExpenseRepository from "../../repositories/crm/expenseRepository";
import ExpenseService from "../../services/crm/expenseServiec";
import PurchaseRepository from "../../repositories/crm/purchasesRepository";
import PurchasesService from "../../services/crm/purchaeseService";

const servicesLoader = (repositories: {
  userRepository: UserRepository;
  vendorRepository: VendorRepository;
  customerRepository: CustomerRepository;
  categorieRepository: CategorieRepository;
  productRepository: ProductRepository;
  orderRepository: OrderRepository;
  expenseRepository: ExpenseRepository;
  purchaseRepository: PurchaseRepository;
}) => {
  const userService = new UserService(repositories.userRepository);
  const vendorService = new VendorService(repositories.vendorRepository);
  const customerService = new CustomerService(repositories.customerRepository);
  const categorieService = new CategorieService(
    repositories.categorieRepository
  );
  const productService = new ProductService(repositories.productRepository);
  const orderService = new OrderService(repositories.orderRepository);
  const expenseService = new ExpenseService(repositories.expenseRepository);
  const purchaseService = new PurchasesService(repositories.purchaseRepository);

  return {
    userService,
    vendorService,
    customerService,
    categorieService,
    productService,
    orderService,
    expenseService,
    purchaseService,
  };
};

export default servicesLoader;
