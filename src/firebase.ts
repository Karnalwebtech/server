import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

// Load environment variables if not loaded already
import * as dotenv from "dotenv";
dotenv.config(); // Ensure this is at the top

// Define the service account object using camelCase keys
const serviceAccount: ServiceAccount = {
  projectId: process.env.GOOGLE_PROJECT_ID,
  privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Handle newlines in the private key
  clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
};

// Initialize Firebase
export const initFirebase_1 = async () => {
  if (!admin.apps.length) {
    // Only initialize if there are no existing apps
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    console.log("Firebase initialized");
  }
  return admin.storage().bucket(); // Return the bucket reference
};

// Initialize Firebase
const initFirebase_karnalweb_2 = async () => {
  if (!admin.apps.length) {
    // Only initialize if there are no existing apps
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    console.log("Firebase initialized");
  }
  return admin.storage().bucket(); // Return the bucket reference
};

export const getFirebaseInstance = (instance: string) => {
  switch (instance) {
    case "crm":
      return initFirebase_1();
    case "karnalwebtech":
      console.log("karnalwebtech")
      return initFirebase_karnalweb_2();
    default:
      throw new Error("Invalid Firebase instance");
  }
};
