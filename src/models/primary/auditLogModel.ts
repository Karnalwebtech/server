import mongoose, { Document, Schema, Types } from 'mongoose';
import { primaryConnection } from "../../loaders/config";
export interface IAuditLog extends Document {
  _no: number;
  userId: Types.ObjectId; // Ensure it's of type ObjectId
  updateLogs: {
    updatedBy: Types.ObjectId; // Also ensure it's ObjectId
    updatedFields: any;
    timestamp: Date;
  }[];
}

const auditLogSchema = new Schema<IAuditLog>({
  _no: {
    type: Number,
    default:0,
  },
  userId: { type: Schema.Types.ObjectId,    ref: "User"},
  updateLogs: [{
    updatedBy: { type: Schema.Types.ObjectId,    ref: "User"},
    updatedFields: { type: Schema.Types.Mixed, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
});

const AuditLog = primaryConnection.model<IAuditLog>('AuditLog', auditLogSchema);
export default AuditLog;
