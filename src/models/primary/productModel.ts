import mongoose, { Document, Types, Model, Schema } from "mongoose";
import { primaryConnection } from "../../loaders/config";
export interface Iproduct extends Document {
  _no: number;
  prod_id: string;
  name?: string;
  status?: string;
  selling_price?: number;
  tax?: string;
  primary_unit?: string;
  sku?: string;
  hsn?: string;
  purchase_price?: number;
  categorie?: Types.ObjectId;
  total_quantity?: number;
  barcode?: string;
  weight?: number;
  depth?: number;
  width?: number;
  height?: number;
  description: string;
  images_id: Types.ObjectId;
  audit_log: Types.ObjectId;
  is_active?: string; // Optional field
  is_delete?: string; // Optional field
}

const productschema: Schema<Iproduct> = new mongoose.Schema(
  {
    _no: {
      type: Number,
      default:0,
    },
    prod_id: {
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
    selling_price: {
      type: Number,
      default: 0,
    },
    tax: {
      type: String,
      default: null,
    },
    primary_unit: {
      type: String,
      default: null,
    },
    sku: {
      type: String,
      default: null,
    },
    hsn: {
      type: String,
      default: null,
    },
    purchase_price: {
      type: Number,
      default: 0,
    },
    categorie: {
      type: Schema.Types.ObjectId,
      ref: "Categorie",
    },

    total_quantity: {
      type: Number,
      default: 0,
    },
    barcode: {
      type: String,
      default: null,
    },
    weight: {
      type: Number,
      default: 0,
    },
    depth: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
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

const Product_model: Model<Iproduct> = primaryConnection.model<Iproduct>(
  "Products",
  productschema
);
export default Product_model;
