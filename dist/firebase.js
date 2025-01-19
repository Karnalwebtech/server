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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirebaseInstance = exports.initFirebase_1 = void 0;
const admin = __importStar(require("firebase-admin"));
// Load environment variables if not loaded already
const dotenv = __importStar(require("dotenv"));
dotenv.config(); // Ensure this is at the top
// Define the service account object using camelCase keys
const serviceAccount = {
    projectId: process.env.GOOGLE_PROJECT_ID,
    privateKey: (_a = process.env.GOOGLE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, "\n"), // Handle newlines in the private key
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
};
// Initialize Firebase
const initFirebase_1 = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!admin.apps.length) {
        // Only initialize if there are no existing apps
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
        console.log("Firebase initialized");
    }
    return admin.storage().bucket(); // Return the bucket reference
});
exports.initFirebase_1 = initFirebase_1;
// Initialize Firebase
const initFirebase_karnalweb_2 = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!admin.apps.length) {
        // Only initialize if there are no existing apps
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
        console.log("Firebase initialized");
    }
    return admin.storage().bucket(); // Return the bucket reference
});
const getFirebaseInstance = (instance) => {
    switch (instance) {
        case "crm":
            return (0, exports.initFirebase_1)();
        case "karnalwebtech":
            console.log("karnalwebtech");
            return initFirebase_karnalweb_2();
        default:
            throw new Error("Invalid Firebase instance");
    }
};
exports.getFirebaseInstance = getFirebaseInstance;
