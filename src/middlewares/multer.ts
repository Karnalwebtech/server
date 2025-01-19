import multer from "multer";

// Define the storage configuration
const storage = multer.memoryStorage(); // Change to memory storage

// Create the upload middleware with file size limits
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit
  },
});

// Export the upload middleware
export default upload;
