"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageUploader = void 0;
const ErrorHandler_1 = __importDefault(require("./ErrorHandler")); // Ensure this is correct
const firebase_1 = require("../firebase");
const generateRandomId_1 = require("./generateRandomId");
class ImageUploader {
    // Function to handle image uploads
    uploadImage(files_1, next_1) {
        return __awaiter(this, arguments, void 0, function* (files, next, firebase_key = "crm") {
            if (!files || !Array.isArray(files) || files.length === 0) {
                return next(new ErrorHandler_1.default("No files uploaded.", 400));
            }
            const uploadPromises = files.map((file) => __awaiter(this, void 0, void 0, function* () {
                if (!file.buffer) {
                    return next(new ErrorHandler_1.default("File buffer is missing.", 400));
                }
                // Generate a unique filename
                const uniqueFilename = `${Date.now()}-${file.originalname}`;
                const bucket = yield (0, firebase_1.getFirebaseInstance)(firebase_key);
                const blob = bucket.file(uniqueFilename); // Use the unique filename
                const blobStream = blob.createWriteStream({
                    resumable: false,
                    metadata: {
                        contentType: file.mimetype,
                        metadata: {
                            firebaseStorageDownloadTokens: (0, generateRandomId_1.generateRandomId)(), // Set a token
                        },
                    },
                });
                return new Promise((resolve, reject) => {
                    blobStream.on("error", (error) => {
                        console.error("Blob Stream Error:", error);
                        reject(error);
                    });
                    blobStream.on("finish", () => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        try {
                            const token = (0, generateRandomId_1.generateRandomId)(); // Create a new token
                            yield blob.setMetadata({
                                metadata: {
                                    firebaseStorageDownloadTokens: token, // Set the download token
                                },
                            });
                            const [metadata] = yield blob.getMetadata(); // Retrieve updated metadata
                            const downloadToken = (_a = metadata.metadata) === null || _a === void 0 ? void 0 : _a.firebaseStorageDownloadTokens; // Get the token
                            // Check if metadata.name is defined before using it
                            if (metadata.name) {
                                const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${metadata.bucket}/o/${encodeURIComponent(metadata.name)}?alt=media&token=${downloadToken}`;
                                resolve({
                                    success: true,
                                    file: uniqueFilename,
                                    url: downloadUrl,
                                });
                            }
                            else {
                                console.error("Metadata name is missing.");
                                reject(new ErrorHandler_1.default("Failed to retrieve metadata name.", 500));
                            }
                        }
                        catch (error) {
                            console.error("Error retrieving metadata:", error);
                            reject(new ErrorHandler_1.default("Failed to retrieve metadata.", 500));
                        }
                    }));
                    blobStream.end(file.buffer); // Upload the buffer
                });
            }));
            try {
                return yield Promise.all(uploadPromises);
            }
            catch (error) {
                console.error("Upload Error:", error); // Log the error
                return next(new ErrorHandler_1.default(error.message, 500));
            }
        });
    }
}
exports.ImageUploader = ImageUploader;
