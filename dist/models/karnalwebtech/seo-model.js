"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = require("../../loaders/config");
const slugify_1 = __importDefault(require("slugify"));
const SeoSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    meta_description: { type: String, required: true },
    keywords: [{ type: String }],
    og_title: { type: String },
    og_description: { type: String },
    og_image: { type: String },
    twitter_card: { type: String },
    twitter_title: { type: String },
    twitter_description: { type: String },
    twitter_image: { type: String },
    canonical_url: { type: String },
    robots: { type: String, default: "index, follow" }, // Default to allow indexing and following
}, {
    timestamps: true,
});
SeoSchema.methods.generateSlug = function () {
    return (0, slugify_1.default)(this.canonical_url, {
        lower: true,
        strict: true,
        replacement: "-",
    });
};
// Method to generate meta description from content
SeoSchema.methods.generateMetaDescription = function () {
    return this.content ? this.content.substring(0, 160) : "";
};
SeoSchema.pre("save", function (next) {
    if (!this.canonical_url) {
        this.canonical_url = this.generateSlug();
    }
    if (!this.meta_description) {
        this.meta_description = this.generateMetaDescription();
    }
    next();
});
const Karnal_SeoModel = config_1.thardConnection.model("Karnal_web_seo", SeoSchema);
exports.default = Karnal_SeoModel;
