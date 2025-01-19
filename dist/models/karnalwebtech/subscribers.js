"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = require("../../loaders/config");
// Define the Post Schema
const SubscribersSchema = new mongoose_1.Schema({
    _no: { type: Number, default: 0 },
    susb_id: { type: String, default: null },
    email: { type: String, default: null },
    is_active: { type: Boolean, default: true },
    is_delete: { type: Boolean, default: false },
    audit_log: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
// Create and export the model
const subscribersModel = config_1.thardConnection.model("karnal_subscribers", SubscribersSchema);
exports.default = subscribersModel;
