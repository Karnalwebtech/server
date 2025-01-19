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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const config_1 = require("../../loaders/config");
// Define the image schema
const imageSchema = new mongoose_1.default.Schema({
    _no: {
        type: Number,
        default: 0,
    },
    originalname: {
        type: String,
        default: null,
    },
    displayedpath: {
        type: String,
        default: null,
    },
    encoding: {
        type: String,
        default: null,
    },
    filename: {
        type: String,
        default: null,
    },
    fieldname: {
        type: String,
        default: null,
    },
    path: {
        type: String,
        default: null,
    },
    size: {
        type: Number,
        default: null,
    },
    altText: {
        type: String,
        default: null,
    },
    title: {
        type: String,
        default: null,
    },
    caption: {
        type: String,
        default: null,
    },
    seo: { type: mongoose_1.Schema.Types.ObjectId, ref: "Karnal_web_seo" },
    status: {
        type: Boolean,
        default: true,
    },
    audit_log: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    is_active: {
        type: Boolean,
        default: false,
    },
    is_delete: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
// Create and export the Image model
const KarnalwebtechImageModel = config_1.thardConnection.model("Karnal_Images", imageSchema);
exports.default = KarnalwebtechImageModel;
