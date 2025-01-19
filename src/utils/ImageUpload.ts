import { NextFunction } from "express";
import ErrorHandler from "./ErrorHandler"; // Ensure this is correct
import { getFirebaseInstance } from "../firebase";
import { generateRandomId } from "./generateRandomId";

export class ImageUploader {
  // Function to handle image uploads
  async uploadImage(files: any, next: NextFunction,firebase_key:string="crm") {
    if (!files || !Array.isArray(files) || files.length === 0) {
      return next(new ErrorHandler("No files uploaded.", 400));
    }

    const uploadPromises = files.map(async (file) => {
      if (!file.buffer) {
        return next(new ErrorHandler("File buffer is missing.", 400));
      }

      // Generate a unique filename
      const uniqueFilename = `${Date.now()}-${file.originalname}`;
      const bucket = await getFirebaseInstance(firebase_key);
      const blob = bucket.file(uniqueFilename); // Use the unique filename

      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: file.mimetype,
          metadata: {
            firebaseStorageDownloadTokens: generateRandomId(), // Set a token
          },
        },
      });

      return new Promise((resolve, reject) => {
        blobStream.on("error", (error:any) => {
          console.error("Blob Stream Error:", error);
          reject(error);
        });

        blobStream.on("finish", async () => {
          try {
              const token = generateRandomId(); // Create a new token
              await blob.setMetadata({
                  metadata: {
                      firebaseStorageDownloadTokens: token, // Set the download token
                  },
              });
      
              const [metadata] = await blob.getMetadata(); // Retrieve updated metadata
              const downloadToken = metadata.metadata?.firebaseStorageDownloadTokens; // Get the token
      
      
              // Check if metadata.name is defined before using it
              if (metadata.name) {
                  const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${metadata.bucket}/o/${encodeURIComponent(metadata.name)}?alt=media&token=${downloadToken}`;
                  resolve({
                      success: true,
                      file: uniqueFilename,
                      url: downloadUrl,
                  });
              } else {
                  console.error("Metadata name is missing.");
                  reject(new ErrorHandler("Failed to retrieve metadata name.", 500));
              }
          } catch (error) {
              console.error("Error retrieving metadata:", error);
              reject(new ErrorHandler("Failed to retrieve metadata.", 500));
          }
      });
      
      

        blobStream.end(file.buffer); // Upload the buffer
      });
    });

    try {
      return await Promise.all(uploadPromises);
    } catch (error: any) {
      console.error("Upload Error:", error); // Log the error
      return next(new ErrorHandler(error.message, 500));
    }
  }
}
