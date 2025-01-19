"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = require("../../loaders/config");
const auditLogSchema = new mongoose_1.Schema({
    _no: {
        type: Number,
        default: 0,
    },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    updateLogs: [{
            updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
            updatedFields: { type: mongoose_1.Schema.Types.Mixed, required: true },
            timestamp: { type: Date, default: Date.now }
        }]
});
const AuditLog = config_1.primaryConnection.model('AuditLog', auditLogSchema);
exports.default = AuditLog;
