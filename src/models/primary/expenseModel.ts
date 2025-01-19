import mongoose, { Document, Types, Model, Schema } from "mongoose";
import { primaryConnection } from "../../loaders/config";
export interface Iexpense extends Document {
  _no: number;
  expense_id: string;
  name: string;
  description: string;
  categorie: string;
  payment_mode: string;
  payment_type: string;
  notes: string;
  amount: number;
  images_id: Types.ObjectId;
  status: string;
  audit_log: Types.ObjectId;
  is_active?: string; // Optional field
  is_delete?: string; // Optional field
}

const expenseSchema: Schema<Iexpense> = new mongoose.Schema(
  {
    _no: {
      type: Number,
      default:0,
    },
    expense_id: {
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
    categorie: {
      type: String,
      trim: true,
      default: null,
    },
    payment_mode: {
      type: String,
      trim: true,
      default: null,
    },
    payment_type: {
      type: String,
      trim: true,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: null,
    },
    amount: {
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

const Expenses_model: Model<Iexpense> = primaryConnection.model<Iexpense>(
  "Expenses",
  expenseSchema
);
export default Expenses_model;
