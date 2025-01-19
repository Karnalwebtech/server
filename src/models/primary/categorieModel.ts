import mongoose, { Document, Types, Model, Schema } from "mongoose";
import { primaryConnection } from "../../loaders/config";
export interface Icategory extends Document {
  _no: number;
  cat_id: string;
  name: string;
  description: string;
  images_id: Types.ObjectId;
  status: string;
  audit_log: Types.ObjectId;
  is_active?: string; // Optional field
  is_delete?: string; // Optional field
}

const categorieSchema: Schema<Icategory> = new mongoose.Schema(
  {
    _no: {
      type: Number,
      default:0,
    },
    cat_id: {
      type: String,
      trim: true,
      default: null,
    },
    name: {
      type: String,
      trim: true,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    images_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "Images",
      },
    ],
    status: {
      type: String,
      default: "active",
    },
    audit_log: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    is_active: {
      type: String,
      default: "yes",
    },
    is_delete: {
      type: String,
      default: "no",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Categorie_model: Model<Icategory> = primaryConnection.model<Icategory>(
  "Categorie",
  categorieSchema
);
export default Categorie_model;
