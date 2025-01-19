import { Model } from "mongoose";
import Karnal_SeoModel from "../../models/karnalwebtech/seo-model";

// Extend the getModel function to handle different types dynamically
export const getSeoModel = <T>(instance: string): Model<T> => {
  switch (instance) {
    case "karnalwebtech":
      return Karnal_SeoModel as unknown as Model<T>; // Explicit cast for IKarnalImage type
    default:
      throw new Error("Invalid Database Instance");
  }
};
