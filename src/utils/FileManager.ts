import fs from "fs";
import path from "path";

export class FileManager {
  // Function to delete multiple files from a directory
  static deleteFiles(files: any, uploadDir: string = "src/uploads/") {
    files.forEach((file: any) => {
      const filePath = path.resolve(uploadDir, file.filename);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${filePath}`, err);
        } else {
          console.log(`File ${file.filename} successfully deleted.`);
        }
      });
    });
  }
}
