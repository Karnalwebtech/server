import CustomerRepository from "../../repositories/crm/customerRepository";
import ExpenseRepository from "../../repositories/crm/expenseRepository";
import OrderRepository from "../../repositories/crm/orderRepository";
import ProductRepository from "../../repositories/crm/productRepository";
import PurchaseRepository from "../../repositories/crm/purchasesRepository";
import UserRepository from "../../repositories/crm/userRepository";
import VendorRepository from "../../repositories/crm/vendorRepository";
import CategorieRepository from "../../repositories/crm/categorieRepository";

 const repositoriesLoader = () => {
  const userRepository = new UserRepository();
  const vendorRepository = new VendorRepository();
  const customerRepository = new CustomerRepository();
  const categorieRepository = new CategorieRepository();
  const productRepository = new ProductRepository();
  const orderRepository = new OrderRepository();
  const expenseRepository = new ExpenseRepository();
  const purchaseRepository = new PurchaseRepository();
  return {
    userRepository,
    vendorRepository,
    customerRepository,
    categorieRepository,
    productRepository,
    orderRepository,
    expenseRepository,
    purchaseRepository,
  };
};
export default repositoriesLoader;