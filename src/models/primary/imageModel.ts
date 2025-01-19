import mongoose, { Document, Model, Types, Schema } from "mongoose";
import { primaryConnection } from "../../loaders/config";
// Define the Iimages interface to match the image data structure
export interface IImages extends Document {
  _no: number;
  originalname: string;
  encoding: string;
  mimetype: string;
  fieldname: string;
  filename: string;
  path: string;
  size: number;
  altText: string;
  title: string;
  caption: string;
  audit_log: Types.ObjectId;
  status: string;
  is_active?: string; // Optional field
  is_delete?: string;
}

// Define the image schema
const imageSchema: Schema<IImages> = new mongoose.Schema(
  {
    _no: {
      type: Number,
      default:0,
    },
    originalname: {
      type: String,
      default: null,
    },
    encoding: {
      type: String,
      default: null,
    },
    filename: {
      type: String,
      default: null,
    },
    fieldname: {
      type: String,
      default: null,
    },
    path: {
      type: String,
      default: null,
    },
    size: {
      type: Number,
      default: null,
    },
    altText: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    caption: {
      type: String,
      default: null,
    },
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

// Create and export the Image model
const ImageModel: Model<IImages> = primaryConnection.model<IImages>(
  "Images",
  imageSchema
);

export default ImageModel;
