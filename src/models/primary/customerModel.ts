import mongoose, { Document, Model, Types, Schema } from "mongoose";
import { primaryConnection } from "../../loaders/config";
export interface ICustomer extends Document {
  _no: number;
  customer_id: string;
  name: string;
  phone: string;
  email: string;
  company_name: string;
  gstin: string;
  billing_address: Types.ObjectId;
  shipping_address: Types.ObjectId;
  country: string;
  audit_log: Types.ObjectId;
  status: string;
  is_active?: string; // Optional field
  is_delete?: string; // Optional field
}

const customerSchema: Schema<ICustomer> = new mongoose.Schema(
  {
    _no: {
      type: Number,
      default:0,
    },
    customer_id: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      trim: true,
      default: null,
     
    },
    company_name: {
      type: String,
      trim: true,
     
      default: null,
    },
    gstin: {
      type: String,
      trim: true,
      default: null,
    },
    billing_address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
    shipping_address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
    status: {
      type: String,
      default: "active", // Active by default
    },
    audit_log: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    is_active: {
      type: String,
      default: "yes", // Active by default
    },
    is_delete: {
      type: String,
      default: "no", // Active by default
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the model
const CustomerModel: Model<ICustomer> = primaryConnection.model<ICustomer>(
  "Customer",
  customerSchema
);

export default CustomerModel;
