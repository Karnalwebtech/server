"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const config_1 = require("../../loaders/config");
const customerSchema = new mongoose_1.default.Schema({
    _no: {
        type: Number,
        default: 0,
    },
    customer_id: {
        type: String,
        trim: true,
    },
    name: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
        default: null,
    },
    email: {
        type: String,
        trim: true,
        default: null,
    },
    company_name: {
        type: String,
        trim: true,
        default: null,
    },
    gstin: {
        type: String,
        trim: true,
        default: null,
    },
    billing_address: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Address",
    },
    shipping_address: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Address",
    },
    status: {
        type: String,
        default: "active", // Active by default
    },
    audit_log: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    is_active: {
        type: String,
        default: "yes", // Active by default
    },
    is_delete: {
        type: String,
        default: "no", // Active by default
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
// Create and export the model
const CustomerModel = config_1.primaryConnection.model("Customer", customerSchema);
exports.default = CustomerModel;
