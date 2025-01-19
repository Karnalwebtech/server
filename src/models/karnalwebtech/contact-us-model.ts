import mongoose, { Document, Model, Schema } from "mongoose";
import { thardConnection } from "../../loaders/config";

// Interface for Post document
export interface IContactUs extends Document {
  _no: number;
  name: string;
  description?: string;
  email?: string;
  mobile?: number;
  cont_id: string;
  audit_log: mongoose.Types.ObjectId;
  is_active?: boolean;
  is_delete?: boolean;
}

// Define the Post Schema
const ContactUsSchema: Schema<IContactUs> = new Schema(
  {
    _no: { type: Number, default: 0 },
    mobile: { type: Number, default: 1234567890 },
    cont_id: { type: String, default: null },
    name: { type: String, default: null },
    description: { type: String, default: null },
    email: { type: String, default: null },
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

// Create and export the model
const contactUsModel: Model<IContactUs> = thardConnection.model<IContactUs>(
  "karnal_contact_us",
  ContactUsSchema
);

export default contactUsModel;
