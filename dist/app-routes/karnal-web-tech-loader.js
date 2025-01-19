"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contact_us_route_1 = __importDefault(require("../api/karnalwebtech/routes/contact-us-route"));
const portfolio_route_1 = __importDefault(require("../api/karnalwebtech/routes/portfolio-route"));
const post_categorie_route_1 = __importDefault(require("../api/karnalwebtech/routes/post-categorie-route"));
const post_route_1 = __importDefault(require("../api/karnalwebtech/routes/post-route"));
const subscribers_route_1 = __importDefault(require("../api/karnalwebtech/routes/subscribers-route"));
const tag_route_1 = __importDefault(require("../api/karnalwebtech/routes/tag-route"));
const karnalwebteh_routesLoader = (app, controllers) => {
    app.use("/api/v2/categorie", (0, post_categorie_route_1.default)(controllers.categorieController));
    app.use("/api/v2/tag", (0, tag_route_1.default)(controllers.tagController));
    app.use("/api/v2/post", (0, post_route_1.default)(controllers.postController));
    app.use("/api/v2/portfolio", (0, portfolio_route_1.default)(controllers.portfolioController));
    app.use("/api/v2/contact-us", (0, contact_us_route_1.default)(controllers.contactUsController));
    app.use("/api/v2/subscriber", (0, subscribers_route_1.default)(controllers.subscribersController));
};
exports.default = karnalwebteh_routesLoader;
