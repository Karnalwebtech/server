"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileManager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class FileManager {
    // Function to delete multiple files from a directory
    static deleteFiles(files, uploadDir = "src/uploads/") {
        files.forEach((file) => {
            const filePath = path_1.default.resolve(uploadDir, file.filename);
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${filePath}`, err);
                }
                else {
                    console.log(`File ${file.filename} successfully deleted.`);
                }
            });
        });
    }
}
exports.FileManager = FileManager;
