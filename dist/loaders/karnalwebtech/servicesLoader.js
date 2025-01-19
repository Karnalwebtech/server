"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contact_us_service_1 = __importDefault(require("../../services/karnalwebtech/contact-us-service"));
const portfolio_service_1 = __importDefault(require("../../services/karnalwebtech/portfolio-service"));
const post_caregorie_service_1 = __importDefault(require("../../services/karnalwebtech/post-caregorie-service"));
const post_service_1 = __importDefault(require("../../services/karnalwebtech/post-service"));
const subscribers_service_1 = __importDefault(require("../../services/karnalwebtech/subscribers-service"));
const tag_service_1 = __importDefault(require("../../services/karnalwebtech/tag-service"));
const servicesLoader = (repositories) => {
    const categorieService = new post_caregorie_service_1.default(repositories.categorieRepository);
    const tagService = new tag_service_1.default(repositories.tagRepository);
    const postService = new post_service_1.default(repositories.postRepository);
    const portfoliotService = new portfolio_service_1.default(repositories.portfoliotRepository);
    const contactUsService = new contact_us_service_1.default(repositories.contactUsRepository);
    const subscribersService = new subscribers_service_1.default(repositories.subscribersRepository);
    return {
        categorieService,
        tagService,
        postService,
        portfoliotService,
        contactUsService,
        subscribersService,
    };
};
exports.default = servicesLoader;
