import mongoose, { Document, Model, Schema } from "mongoose";
import { thardConnection } from "../../loaders/config";
import slugify from "slugify";

// Interface for Post document
export interface IPost extends Document {
  _no: number;
  title: string;
  slug: string;
  content?: string;
  description?:string;
  cat_id: string;
  status: string;
  audit_log: mongoose.Types.ObjectId;
  feature_image: mongoose.Types.ObjectId;
  seo: mongoose.Types.ObjectId;
  is_active?: boolean;
  type: string;
  is_delete?: boolean;
  generateSlug: () => string;
  generateDescription: () => string;
}

// Define the Post Schema
const PostSchema: Schema = new Schema(
  {
    _no: { type: Number, default: 0 },
    cat_id: { type: String, default: null },
    description: { type: String, default: null },
    type: { type: String, default: null },
    title: { type: String, default: null },
    slug: { type: String, default: null },
    content: { type: String, default: null },
    feature_image: { type: Schema.Types.ObjectId, ref: "Karnal_web_Image" },
    seo: { type: Schema.Types.ObjectId, ref: "Karnal_web_seo" },
    status: { type: String, default: "Draft" },
    is_active: { type: Boolean, default: true },
    is_delete: { type: Boolean, default: false },
    audit_log: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Method to generate a slug from the title
PostSchema.methods.generateSlug = function (): string {
  return slugify(this.title, { lower: true, strict: true, replacement: "-" });
};

// Pre-save middleware to set slug and description if not provided
PostSchema.pre<IPost>("save", function (next) {
  if (!this.slug) {
    this.slug = this.generateSlug(); // Set the slug if it's not provided
  }
  next();
});

// Create and export the model
const PostCategorieModel: Model<IPost> = thardConnection.model<IPost>(
  "Karnal_categorie",
  PostSchema
);

export default PostCategorieModel;
