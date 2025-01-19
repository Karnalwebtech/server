import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Check if connection strings are defined
const primaryConnStr = process.env.PRIMARY_CONN_STR;
const secondaryConnStr = process.env.SECONDARY_CONN_STR;
const thardConnStr = process.env.THARD_CONN_STR;

if (!primaryConnStr || !secondaryConnStr || !thardConnStr) {
  throw new Error("One or more connection strings are missing.");
}

// MongoDB connections
export const primaryConnection = mongoose.createConnection(primaryConnStr);

primaryConnection.on("connected", () => {
  console.log("PRIMARY DB connected");
});

primaryConnection.on("error", (err: any) => {
  console.error("Error connecting to PRIMARY DB:", err);
});

export const secondaryConnection = mongoose.createConnection(secondaryConnStr);

secondaryConnection.on("connected", () => {
  console.log("SECONDARY DB connected");
});

secondaryConnection.on("error", (err: any) => {
  console.error("Error connecting to SECONDARY DB:", err);
});

export const thardConnection = mongoose.createConnection(thardConnStr);

thardConnection.on("connected", () => {
  console.log("THARD DB connected");
});

thardConnection.on("error", (err: any) => {
  console.error("Error connecting to THARD DB:", err);
});
