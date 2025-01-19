"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_model_1 = __importDefault(require("../models/karnalwebtech/post-model"));
const post_categorie_1 = __importDefault(require("../models/karnalwebtech/post-categorie"));
function generateSitemap() {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = process.env.BASE_URL;
        if (!baseUrl) {
            throw new Error("BASE_URL environment variable is not defined.");
        }
        try {
            // Fetch dynamic routes from the database more efficiently
            const [posts, categories] = yield Promise.all([
                post_model_1.default.find({ is_delete: { $ne: true } }, "slug updatedAt categorie")
                    .populate("categorie", "slug")
                    .lean()
                    .exec(),
                post_categorie_1.default.find({ is_delete: { $ne: true }, type: { $ne: "post" } }, "slug updatedAt")
                    .lean()
                    .exec(),
            ]);
            // Define static routes
            const staticRoutes = [
                { route: "/", lastmod: new Date().toISOString() },
            ];
            // Map dynamic routes
            const postRoutes = posts.map((item) => {
                var _a;
                return ({
                    route: `/${((_a = item.categorie[0]) === null || _a === void 0 ? void 0 : _a.slug) || ""}/${item.slug}`,
                    lastmod: new Date(item.updatedAt).toISOString(),
                });
            });
            const categoryRoutes = categories.map((item) => ({
                route: `/${item.slug}`,
                lastmod: new Date(item.updatedAt).toISOString(),
            }));
            // Combine all routes
            const allRoutes = [
                ...staticRoutes,
                ...categoryRoutes,
                ...postRoutes,
            ];
            // Create sitemap content
            const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
                .map((route) => `  <url>
    <loc>${baseUrl}${route.route}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)
                .join("\n")}
</urlset>`;
            console.log("Sitemap generated successfully!");
            console.log(sitemapContent.trim());
            return sitemapContent.trim();
        }
        catch (error) {
            console.error("Error generating sitemap:", error);
            throw error;
        }
    });
}
exports.default = generateSitemap;
