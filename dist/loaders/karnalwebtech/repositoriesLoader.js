"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contact_us_repositories_1 = __importDefault(require("../../repositories/karnalwebtech/contact-us-repositories"));
const portfolio_repositories_1 = __importDefault(require("../../repositories/karnalwebtech/portfolio-repositories"));
const post_categorie_repositories_1 = __importDefault(require("../../repositories/karnalwebtech/post-categorie-repositories"));
const post_repositories_1 = __importDefault(require("../../repositories/karnalwebtech/post-repositories"));
const subscribers_repositories_1 = __importDefault(require("../../repositories/karnalwebtech/subscribers-repositories"));
const tag_repositories_1 = __importDefault(require("../../repositories/karnalwebtech/tag-repositories"));
const repositoriesLoader = () => {
    const categorieRepository = new post_categorie_repositories_1.default();
    const tagRepository = new tag_repositories_1.default();
    const postRepository = new post_repositories_1.default();
    const portfoliotRepository = new portfolio_repositories_1.default();
    const contactUsRepository = new contact_us_repositories_1.default();
    const subscribersRepository = new subscribers_repositories_1.default();
    return {
        categorieRepository,
        tagRepository,
        postRepository,
        portfoliotRepository,
        contactUsRepository,
        subscribersRepository,
    };
};
exports.default = repositoriesLoader;
