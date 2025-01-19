"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vendorRoutes_1 = __importDefault(require("../api/crm/routes/vendorRoutes"));
const customerRoutes_1 = __importDefault(require("../api/crm/routes/customerRoutes"));
const categorieRoutes_1 = __importDefault(require("../api/crm/routes/categorieRoutes"));
const productRoutes_1 = __importDefault(require("../api/crm/routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("../api/crm/routes/orderRoutes"));
const expenseRoutes_1 = __importDefault(require("../api/crm/routes/expenseRoutes"));
const purchaseRoutes_1 = __importDefault(require("../api/crm/routes/purchaseRoutes"));
const userRoutes_1 = __importDefault(require("../api/crm/routes/userRoutes"));
const crm_routesLoader = (app, controllers) => {
    app.use("/api/auth", (0, userRoutes_1.default)(controllers.userController));
    app.use("/api/vendor", (0, vendorRoutes_1.default)(controllers.vendorController));
    app.use("/api/customer", (0, customerRoutes_1.default)(controllers.customerController));
    app.use("/api/categorie", (0, categorieRoutes_1.default)(controllers.categorieController));
    app.use("/api/product", (0, productRoutes_1.default)(controllers.productController));
    app.use("/api/order", (0, orderRoutes_1.default)(controllers.orderController));
    app.use("/api/expense", (0, expenseRoutes_1.default)(controllers.expenseController));
    app.use("/api/purchase", (0, purchaseRoutes_1.default)(controllers.purchasesController));
};
exports.default = crm_routesLoader;
