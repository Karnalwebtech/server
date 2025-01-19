import AuditLog, { IAuditLog } from "../../models/primary/auditLogModel"; // Adjust the path as necessary
import { Types } from "mongoose";

class AuditLogger {
  // Method to create a new audit log entry
  async logUpdate(
    userId: string, // Make sure this is of type ObjectId
    updatedData: any
  ) {
    const counter = await AuditLog.countDocuments();

    // Specify the return type
    const newAuditLog = new AuditLog({
      _no:counter+1,
      userId,
      updateLogs: [
        {
          updatedBy: userId,
          updatedFields: updatedData,
          timestamp: new Date(),
        },
      ],
    });

    const savedAuditLog = await newAuditLog.save();
    return savedAuditLog._id; // Now this should be recognized as ObjectId
  }

  // Method to find a log by ID
  async findById(id: Types.ObjectId): Promise<IAuditLog | null> {
    return await AuditLog.findOne({ _id: id });
  }
}

export default AuditLogger;
