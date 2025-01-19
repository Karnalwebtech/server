"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = require("../../loaders/config");
// Define the Post Schema
const ContactUsSchema = new mongoose_1.Schema({
    _no: { type: Number, default: 0 },
    mobile: { type: Number, default: 1234567890 },
    cont_id: { type: String, default: null },
    name: { type: String, default: null },
    description: { type: String, default: null },
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
const contactUsModel = config_1.thardConnection.model("karnal_contact_us", ContactUsSchema);
exports.default = contactUsModel;
