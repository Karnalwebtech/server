"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vendorController_1 = __importDefault(require("../../api/crm/controllers/vendorController"));
const customerController_1 = __importDefault(require("../../api/crm/controllers/customerController"));
const categorieController_1 = __importDefault(require("../../api/crm/controllers/categorieController"));
const productController_1 = __importDefault(require("../../api/crm/controllers/productController"));
const orderController_1 = __importDefault(require("../../api/crm/controllers/orderController"));
const expenseController_1 = __importDefault(require("../../api/crm/controllers/expenseController"));
const purchasesController_1 = __importDefault(require("../../api/crm/controllers/purchasesController"));
const userController_1 = __importDefault(require("../../api/crm/controllers/userController"));
const controllersLoader = (services) => {
    const userController = new userController_1.default(services.userService);
    const vendorController = new vendorController_1.default(services.vendorService);
    const customerController = new customerController_1.default(services.customerService);
    const categorieController = new categorieController_1.default(services.categorieService);
    const productController = new productController_1.default(services.productService);
    const orderController = new orderController_1.default(services.orderService);
    const expenseController = new expenseController_1.default(services.expenseService);
    const purchasesController = new purchasesController_1.default(services.purchaseService);
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
exports.default = controllersLoader;
