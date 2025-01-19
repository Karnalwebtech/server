import mongoose, { Document, Schema, Model } from "mongoose";
import { thardConnection } from "../../loaders/config";
import slugify from "slugify";
export interface ISeo extends Document {
  title: string;
  meta_description: string;
  keywords: string[];
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  canonical_url?: string;
  robots?: string;
  generateSlug: () => string;
  generateMetaDescription: () => string;
}

const SeoSchema = new Schema<ISeo>(
  {
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
  },
  {
    timestamps: true,
  }
);

SeoSchema.methods.generateSlug = function (): string {
  return slugify(this.canonical_url, {
    lower: true,
    strict: true,
    replacement: "-",
  });
};
// Method to generate meta description from content
SeoSchema.methods.generateMetaDescription = function (): string {
  return this.content ? this.content.substring(0, 160) : "";
};
SeoSchema.pre<ISeo>("save", function (next) {
  if (!this.canonical_url) {
    this.canonical_url = this.generateSlug();
  }
  if (!this.meta_description) {
    this.meta_description = this.generateMetaDescription();
  }
  next();
});
const Karnal_SeoModel = thardConnection.model<ISeo>(
  "Karnal_web_seo",
  SeoSchema
);

export default Karnal_SeoModel;
