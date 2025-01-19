"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = require("../../loaders/config");
const slugify_1 = __importDefault(require("slugify"));
// Define the Post Schema
const PostSchema = new mongoose_1.Schema({
    _no: { type: Number, default: 0 },
    post_id: { type: String, default: null },
    title: { type: String, default: null },
    description: { type: String, default: null },
    slug: { type: String, default: null },
    content: { type: String, default: null },
    categorie: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Karnal_categorie" }],
    tag: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Karnal_tag" }],
    feature_image: { type: mongoose_1.Schema.Types.ObjectId, ref: "Karnal_web_Image" },
    seo: { type: mongoose_1.Schema.Types.ObjectId, ref: "Karnal_web_seo" },
    status: { type: String, default: "Draft" },
    is_active: { type: Boolean, default: true },
    is_delete: { type: Boolean, default: false },
    audit_log: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
// Method to generate a slug from the title
PostSchema.methods.generateSlug = function () {
    return (0, slugify_1.default)(this.title, { lower: true, strict: true, replacement: "-" });
};
// Pre-save middleware to set slug and description if not provided
PostSchema.pre("save", function (next) {
    if (!this.slug) {
        this.slug = this.generateSlug(); // Set the slug if it's not provided
    }
    next();
});
// Create and export the model
const PostModel = config_1.thardConnection.model("karnal_Post", PostSchema);
exports.default = PostModel;
