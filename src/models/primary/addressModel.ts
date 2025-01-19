import mongoose, { Document, Model, Types, Schema } from "mongoose";
import { primaryConnection } from "../../loaders/config";

export interface IAddress extends Document {
  _no: number;
  address_line_1: string;
  address_line_2?: string; // Make optional if not always provided
  pin_code: string;
  city: string;
  state: string;
  country: string;
  audit_log: Types.ObjectId;
}

const addressSchema: Schema<IAddress> = new mongoose.Schema(
  {
    _no: {
      type: Number,
      default:0,
    },
    address_line_1: {
      type: String,
      trim: true,
    },
    address_line_2: {
      type: String,
      trim: true,
      default: null,
    },
    pin_code: {
      type: String,
      min: 100000, // Minimum 6-digit number
      max: 999999, // Maximum 6-digit number
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    audit_log: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const AddressModel: Model<IAddress> = primaryConnection.model<IAddress>(
  "Address",
  addressSchema
);
export default AddressModel;
