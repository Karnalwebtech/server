"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customerRepository_1 = __importDefault(require("../../repositories/crm/customerRepository"));
const expenseRepository_1 = __importDefault(require("../../repositories/crm/expenseRepository"));
const orderRepository_1 = __importDefault(require("../../repositories/crm/orderRepository"));
const productRepository_1 = __importDefault(require("../../repositories/crm/productRepository"));
const purchasesRepository_1 = __importDefault(require("../../repositories/crm/purchasesRepository"));
const userRepository_1 = __importDefault(require("../../repositories/crm/userRepository"));
const vendorRepository_1 = __importDefault(require("../../repositories/crm/vendorRepository"));
const categorieRepository_1 = __importDefault(require("../../repositories/crm/categorieRepository"));
const repositoriesLoader = () => {
    const userRepository = new userRepository_1.default();
    const vendorRepository = new vendorRepository_1.default();
    const customerRepository = new customerRepository_1.default();
    const categorieRepository = new categorieRepository_1.default();
    const productRepository = new productRepository_1.default();
    const orderRepository = new orderRepository_1.default();
    const expenseRepository = new expenseRepository_1.default();
    const purchaseRepository = new purchasesRepository_1.default();
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
exports.default = repositoriesLoader;
