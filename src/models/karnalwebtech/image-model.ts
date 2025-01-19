import mongoose, { Document, Model, Types, Schema } from "mongoose";
import { thardConnection } from "../../loaders/config";
// Define the IKarnalimages interface to match the image data structure
export interface IKarnalImages extends Document {
  _no: number;
  originalname: string;
  encoding: string;
  mimetype: string;
  fieldname: string;
  filename: string;
  path: string;
  displayedpath: string;
  size: number;
  altText: string;
  title: string;
  caption: string;
  audit_log: Types.ObjectId;
  seo: Types.ObjectId;
  status: boolean;
  is_active?: boolean; // Optional field
  is_delete?: boolean;
}

// Define the image schema
const imageSchema: Schema<IKarnalImages> = new mongoose.Schema(
  {
    _no: {
      type: Number,
      default: 0,
    },
    originalname: {
      type: String,
      default: null,
    },
    displayedpath: {
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
    seo: { type: Schema.Types.ObjectId, ref: "Karnal_web_seo" },
    status: {
      type: Boolean,
      default: true,
    },
    audit_log: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Image model
const KarnalwebtechImageModel: Model<IKarnalImages> =
  thardConnection.model<IKarnalImages>("Karnal_Images", imageSchema);

export default KarnalwebtechImageModel;
