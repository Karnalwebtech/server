import { Model } from "mongoose";
import ImageModel from "../../models/primary/imageModel";
import KarnalwebtechImageModel from "../../models/karnalwebtech/image-model";

// Extend the getModel function to handle different types dynamically
export const getImageModel = <T>(instance: string): Model<T> => {
  switch (instance) {
    case "crm":
      return ImageModel as unknown as Model<T>; // Explicit cast for IImages type
    case "karnalwebtech":
      return KarnalwebtechImageModel as unknown as Model<T>; // Explicit cast for IKarnalImage type
    default:
      throw new Error("Invalid Database Instance");
  }
};
