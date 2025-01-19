"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeoModel = void 0;
const seo_model_1 = __importDefault(require("../../models/karnalwebtech/seo-model"));
// Extend the getModel function to handle different types dynamically
const getSeoModel = (instance) => {
    switch (instance) {
        case "karnalwebtech":
            return seo_model_1.default; // Explicit cast for IKarnalImage type
        default:
            throw new Error("Invalid Database Instance");
    }
};
exports.getSeoModel = getSeoModel;
