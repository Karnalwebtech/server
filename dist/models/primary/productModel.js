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
const productschema = new mongoose_1.default.Schema({
    _no: {
        type: Number,
        default: 0,
    },
    prod_id: {
        type: String,
        trim: true,
        default: null,
    },
    name: {
        type: String,
        trim: true,
        default: null,
    },
    description: {
        type: String,
        trim: true,
        default: null,
    },
    selling_price: {
        type: Number,
        default: 0,
    },
    tax: {
        type: String,
        default: null,
    },
    primary_unit: {
        type: String,
        default: null,
    },
    sku: {
        type: String,
        default: null,
    },
    hsn: {
        type: String,
        default: null,
    },
    purchase_price: {
        type: Number,
        default: 0,
    },
    categorie: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Categorie",
    },
    total_quantity: {
        type: Number,
        default: 0,
    },
    barcode: {
        type: String,
        default: null,
    },
    weight: {
        type: Number,
        default: 0,
    },
    depth: {
        type: Number,
        default: 0,
    },
    width: {
        type: Number,
        default: 0,
    },
    height: {
        type: Number,
        default: 0,
    },
    images_id: [
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
const Product_model = config_1.primaryConnection.model("Products", productschema);
exports.default = Product_model;
