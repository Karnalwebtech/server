"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contact_us_controller_1 = __importDefault(require("../../api/karnalwebtech/controllers/contact-us-controller"));
const portfolio_controller_1 = __importDefault(require("../../api/karnalwebtech/controllers/portfolio-controller"));
const post_categorie_controller_1 = __importDefault(require("../../api/karnalwebtech/controllers/post-categorie-controller"));
const post_controller_1 = __importDefault(require("../../api/karnalwebtech/controllers/post-controller"));
const subscribers_controller_1 = __importDefault(require("../../api/karnalwebtech/controllers/subscribers-controller"));
const tag_controller_1 = __importDefault(require("../../api/karnalwebtech/controllers/tag-controller"));
const controllersLoader = (services) => {
    const categorieController = new post_categorie_controller_1.default(services.categorieService);
    const tagController = new tag_controller_1.default(services.tagService);
    const postController = new post_controller_1.default(services.postService);
    const contactUsController = new contact_us_controller_1.default(services.contactUsService);
    const subscribersController = new subscribers_controller_1.default(services.subscribersService);
    const portfolioController = new portfolio_controller_1.default(services.portfoliotService);
    return {
        categorieController,
        tagController,
        postController,
        portfolioController,
        contactUsController,
        subscribersController,
    };
};
exports.default = controllersLoader;
