import PostModel from "../models/karnalwebtech/post-model";
import PostCategorieModel from "../models/karnalwebtech/post-categorie";
import { Types } from "mongoose";

interface Route {
  route: string;
  lastmod: string;
  updatedAt?: Date;
}

async function generateSitemap(): Promise<string> {
  const baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    throw new Error("BASE_URL environment variable is not defined.");
  }

  try {
    // Fetch dynamic routes from the database more efficiently
    const [posts, categories] = await Promise.all([
      PostModel.find({ is_delete: { $ne: true } }, "slug updatedAt categorie")
        .populate<{ categorie: any[] }>("categorie", "slug")
        .lean()
        .exec(),
      PostCategorieModel.find(
        { is_delete: { $ne: true }, type: { $ne: "post" } },
        "slug updatedAt"
      )
        .lean()
        .exec(),
    ]);

    // Define static routes
    const staticRoutes: Route[] = [
      { route: "/", lastmod: new Date().toISOString() },
    ];

    // Map dynamic routes
    const postRoutes: Route[] = posts.map((item: any) => ({
      route: `/${item.categorie[0]?.slug || ""}/${item.slug}`,
      lastmod: new Date(item.updatedAt).toISOString(),
    }));

    const categoryRoutes: Route[] = categories.map((item: any) => ({
      route: `/${item.slug}`,
      lastmod: new Date(item.updatedAt).toISOString(),
    }));

    // Combine all routes
    const allRoutes: Route[] = [
      ...staticRoutes,
      ...categoryRoutes,
      ...postRoutes,
    ];

    // Create sitemap content
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route.route}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    console.log("Sitemap generated successfully!");
    console.log(sitemapContent.trim());
    return sitemapContent.trim();
  } catch (error) {
    console.error("Error generating sitemap:", error);
    throw error;
  }
}

export default generateSitemap;
