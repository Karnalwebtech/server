"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/loaders/servicesLoader.ts
const userService_1 = __importDefault(require("../../services/crm/userService"));
const vendorService_1 = __importDefault(require("../../services/crm/vendorService"));
const customerService_1 = __importDefault(require("../../services/crm/customerService"));
const categorieService_1 = __importDefault(require("../../services/crm/categorieService"));
const productService_1 = __importDefault(require("../../services/crm/productService"));
const orderService_1 = __importDefault(require("../../services/crm/orderService"));
const expenseServiec_1 = __importDefault(require("../../services/crm/expenseServiec"));
const purchaeseService_1 = __importDefault(require("../../services/crm/purchaeseService"));
const servicesLoader = (repositories) => {
    const userService = new userService_1.default(repositories.userRepository);
    const vendorService = new vendorService_1.default(repositories.vendorRepository);
    const customerService = new customerService_1.default(repositories.customerRepository);
    const categorieService = new categorieService_1.default(repositories.categorieRepository);
    const productService = new productService_1.default(repositories.productRepository);
    const orderService = new orderService_1.default(repositories.orderRepository);
    const expenseService = new expenseServiec_1.default(repositories.expenseRepository);
    const purchaseService = new purchaeseService_1.default(repositories.purchaseRepository);
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
exports.default = servicesLoader;
