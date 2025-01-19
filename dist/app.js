"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
// import csurf from "csurf";
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const error_1 = __importDefault(require("./middlewares/error"));
app.set('trust proxy', 1);
// Middleware to parse JSON bodies
// Middleware to parse URL-encoded bodies (form submissions)
app.disable("x-powered-by");
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
});
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://karnalwebtech.vercel.app",
        "https://inventory-7773.vercel.app",
        "https://karnalwebtech-two.vercel.app",
        "https://www.thesalesmens.com",
        "https://thesalesmens.com"
    ], // Allow only your frontend to access the API
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    exposedHeaders: "Set-Cookie",
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-CSRF-Token",
    ],
    credentials: true, // Allow sending cookies and other credentials
    optionsSuccessStatus: 200,
    preflightContinue: false,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
    },
}));
app.use(limiter);
// app.use(helmet.noCache());
//-----loaders
//------------------ crm
const repositoriesLoader_1 = __importDefault(require("./loaders/crm/repositoriesLoader"));
const servicesLoader_1 = __importDefault(require("./loaders/crm/servicesLoader"));
const controllersLoader_1 = __importDefault(require("./loaders/crm/controllersLoader"));
const crm_Loader_1 = __importDefault(require("./app-routes/crm-Loader"));
const crm_repositories = (0, repositoriesLoader_1.default)();
const crm_services = (0, servicesLoader_1.default)(crm_repositories);
// Initialize Controllers
const crm_controllers = (0, controllersLoader_1.default)(crm_services);
(0, crm_Loader_1.default)(app, crm_controllers);
//--------------------- karnalweb tech
const repositoriesLoader_2 = __importDefault(require("./loaders/karnalwebtech/repositoriesLoader"));
const servicesLoader_2 = __importDefault(require("./loaders/karnalwebtech/servicesLoader"));
const controllersLoader_2 = __importDefault(require("./loaders/karnalwebtech/controllersLoader"));
const karnal_web_tech_loader_1 = __importDefault(require("./app-routes/karnal-web-tech-loader"));
const imageRepository_1 = __importDefault(require("./utils/comman-repositories/imageRepository"));
const image_controller_1 = __importDefault(require("./api/karnalwebtech/controllers/image-controller"));
// import portfolioRoutes from "./api/karnalwebtech/routes/portfolio-route";
const cache_route_1 = __importDefault(require("./api/karnalwebtech/routes/cache-route"));
const image_route_1 = __importDefault(require("./api/karnalwebtech/routes/image-route"));
const karnal_repositories = (0, repositoriesLoader_2.default)();
const karnal_services = (0, servicesLoader_2.default)(karnal_repositories);
// Initialize Controllers
const karnal_controllers = (0, controllersLoader_2.default)(karnal_services);
(0, karnal_web_tech_loader_1.default)(app, karnal_controllers);
//comman router
// Initialize dependencies
const imageRepository = new imageRepository_1.default();
const imageController = new image_controller_1.default(imageRepository);
// Add routes
app.use("/api/v2/image", (0, image_route_1.default)(imageController));
app.use("/api/v2/", cache_route_1.default);
//--------------- allmiddleware
app.use(error_1.default);
exports.default = app;
