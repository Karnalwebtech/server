"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageModel = void 0;
const imageModel_1 = __importDefault(require("../../models/primary/imageModel"));
const image_model_1 = __importDefault(require("../../models/karnalwebtech/image-model"));
// Extend the getModel function to handle different types dynamically
const getImageModel = (instance) => {
    switch (instance) {
        case "crm":
            return imageModel_1.default; // Explicit cast for IImages type
        case "karnalwebtech":
            return image_model_1.default; // Explicit cast for IKarnalImage type
        default:
            throw new Error("Invalid Database Instance");
    }
};
exports.getImageModel = getImageModel;
