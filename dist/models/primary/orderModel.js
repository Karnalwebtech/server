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
const orderSchema = new mongoose_1.default.Schema({
    order_no: {
        type: Number,
    },
    order_id: {
        type: String,
        trim: true,
        default: null,
    },
    tax_status: {
        type: String,
        trim: true,
        default: null,
    },
    name: {
        type: String,
        trim: true,
        default: null,
    },
    dispatch_mod: {
        type: String,
        trim: true,
        default: null,
    },
    email: {
        type: String,
        default: null,
    },
    gstin: {
        type: String,
        default: null,
    },
    order_date: {
        type: Date,
        default: null,
    },
    order_status: {
        type: String,
        default: null,
    },
    invoice_no: {
        type: String,
        default: null,
    },
    payment_mode: {
        type: String,
        default: null,
    },
    notes: {
        type: String,
        default: null,
    },
    company: {
        type: String,
        default: null,
    },
    phone: {
        type: String,
        default: null,
    },
    shipping_charges: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
    },
    other_charge: {
        type: Number,
        default: 0,
    },
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Customer",
    },
    shipping_address: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Address",
    },
    order_details: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Orders_details",
    },
    image_id: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Images",
        },
    ],
    doket_id: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Images",
        },
    ],
    invoice_id: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Images",
        },
    ],
    status: {
        type: String,
        default: "active",
    },
    audit_log: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
const Order_model = config_1.primaryConnection.model("Orders", orderSchema);
exports.default = Order_model;
