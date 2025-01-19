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
exports.test = test;
const IP2Location = __importStar(require("ip2location-nodejs"));
// Initialize the IP2Location database using the correct method
const ip2location = new IP2Location.IP2Location();
// Initialize the database with the path to the .BIN file
ip2location.open("path/to/IP2LOCATION-LITE-DB1.BIN");
function test() {
    // Sample IP addresses
    const ipAddresses = [
        "8.8.8.8", // Google DNS
        "1.1.1.1", // Cloudflare DNS
        "128.101.101.101" // University of Minnesota
    ];
    ipAddresses.forEach((ip) => {
        // Get location data for the IP address
        const result = ip2location.getAll(ip);
        console.log("asdasdasdasd", ip2location);
        console.log(`IP Address: ${ip}`);
        // console.log(`Country: ${result.country_long}`);
        console.log(`Region: ${result.region}`);
        console.log(`City: ${result.city}`);
        console.log(`ISP: ${result.isp}`);
        console.log("----------------------------");
    });
    // No explicit close method is required, but it's good practice
    ip2location.close();
}
