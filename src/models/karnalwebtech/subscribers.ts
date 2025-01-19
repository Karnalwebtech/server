import mongoose, { Document, Model, Schema } from "mongoose";
import { thardConnection } from "../../loaders/config";

// Interface for Post document
export interface Isubscribers extends Document {
  _no: number;
  email?: string;
  susb_id: string;
  is_active?: boolean;
  is_delete?: boolean;
  audit_log: mongoose.Types.ObjectId;
}

// Define the Post Schema
const SubscribersSchema: Schema<Isubscribers> = new Schema(
  {
    _no: { type: Number, default: 0 },
    susb_id: { type: String, default: null },
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
const subscribersModel: Model<Isubscribers> =
  thardConnection.model<Isubscribers>("karnal_subscribers", SubscribersSchema);

export default subscribersModel;
