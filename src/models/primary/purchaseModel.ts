import mongoose, { Document, Types, Model, Schema } from "mongoose";
import { primaryConnection } from "../../loaders/config";
export interface IPurchase extends Document {
  purchase_no: number;
  purchase_id: string;
  purchase_date: Date;
  due_date: Date;
  supplier_invoice_date: Date;
  supplier_invoice_serial_no: string;
  reference: string;
  payment_mode: string;
  tax_status: string;
  notes: string;
  status: string;
  shipping_charges?: Number;
  discount?: Number;
  other_charge?: Number;
  order_details?: Types.ObjectId;
  vendor?: Types.ObjectId;
  image_id: Types.ObjectId;
  doket_id: Types.ObjectId;
  invoice_id: Types.ObjectId;
  audit_log: Types.ObjectId;
  is_active?: string; // Optional field
  is_delete?: string; // Optional field
}

const orderSchema: Schema<IPurchase> = new mongoose.Schema(
  {
    purchase_no: {
      type: Number,
      default: 0,
    },
    purchase_id: {
      type: String,
      default: null,
    },
    purchase_date: {
      type: Date,
      default: null,
    },
    due_date: {
      type: Date,
      default: null,
    },
    supplier_invoice_date: {
      type: Date,
      default: null,
    },
    supplier_invoice_serial_no: {
      type: String,
      default: null,
    },
    reference: {
      type: String,
      default: null,
    },
    tax_status: {
      type: String,
      trim: true,
      default: null,
    },
    payment_mode: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
    shipping_charges: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    other_charge: {
      type: Number,
      default: 0,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
    },
    order_details: {
      type: Schema.Types.ObjectId,
      ref: "Orders_details",
    },
    image_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "Images",
      },
    ],
    doket_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "Images",
      },
    ],
    invoice_id: [
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

const Purchase_model: Model<IPurchase> = primaryConnection.model<IPurchase>(
  "Purchases",
  orderSchema
);
export default Purchase_model;
