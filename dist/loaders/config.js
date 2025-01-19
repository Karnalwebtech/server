"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.thardConnection = exports.secondaryConnection = exports.primaryConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Check if connection strings are defined
const primaryConnStr = process.env.PRIMARY_CONN_STR;
const secondaryConnStr = process.env.SECONDARY_CONN_STR;
const thardConnStr = process.env.THARD_CONN_STR;
if (!primaryConnStr || !secondaryConnStr || !thardConnStr) {
    throw new Error("One or more connection strings are missing.");
}
// MongoDB connections
exports.primaryConnection = mongoose_1.default.createConnection(primaryConnStr);
exports.primaryConnection.on("connected", () => {
    console.log("PRIMARY DB connected");
});
exports.primaryConnection.on("error", (err) => {
    console.error("Error connecting to PRIMARY DB:", err);
});
exports.secondaryConnection = mongoose_1.default.createConnection(secondaryConnStr);
exports.secondaryConnection.on("connected", () => {
    console.log("SECONDARY DB connected");
});
exports.secondaryConnection.on("error", (err) => {
    console.error("Error connecting to SECONDARY DB:", err);
});
exports.thardConnection = mongoose_1.default.createConnection(thardConnStr);
exports.thardConnection.on("connected", () => {
    console.log("THARD DB connected");
});
exports.thardConnection.on("error", (err) => {
    console.error("Error connecting to THARD DB:", err);
});
