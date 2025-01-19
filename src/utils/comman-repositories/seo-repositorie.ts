import { NextFunction } from "express";
import ErrorHandler from "../ErrorHandler";
import { getSeoModel } from "../models-handler/seo-model-handler";

// Utility function to generate SEO data
const generateSeoData = (data: any, ogImageUrl: string) => ({
  title: data.metaTitle || data.title,
  meta_description: data.metaDescription || "Karnal web tech",
  keywords: (data.keywords || "").split(","),
  og_title: data.metaTitle || data.title,
  og_description: data.metaDescription || "Karnal web tech",
  og_image: ogImageUrl,
  twitter_card: "summary_large_image",
  twitter_title: data.metaTitle || data.title,
  twitter_description: data.metaDescription || "Karnal web tech",
  twitter_image: ogImageUrl,
  canonical_url: data.metaCanonicalUrl.toLowerCase() || "",
});

class SeoRepositorie {
  // Create SEO record
  create(data: any, image_uploader: any, next: NextFunction,image_patgh?:string) {
    const ogImageUrl = image_uploader[0]?.path || image_patgh; // Fallback to an empty string if undefined

    try {
      const seo_data = generateSeoData(data, ogImageUrl);
      const seo = getSeoModel("karnalwebtech").create(seo_data);
      return seo;
    } catch (error: unknown) {
      return this.handleError(error, next);
    }
  }

  // Update SEO record
  async update(
    data: any,
    prev_seo_data: any,
    imageData: any,
    next: NextFunction
  ) {
    const id = prev_seo_data._id;
    const prev_image = prev_seo_data?.og_image;
    const current_image =
      imageData && imageData.length > 0 ? imageData[0]?.path : prev_image;
    try {
      const seo_data = generateSeoData(data, current_image);
      return await getSeoModel("karnalwebtech").findByIdAndUpdate(
        id,
        seo_data,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
    } catch (error: unknown) {
      return this.handleError(error, next);
    }
  }

  // Centralized error handling
  private handleError(error: unknown, next: NextFunction) {
    if (error instanceof Error) {
      return next(new ErrorHandler(error.message, 404));
    }
    return next(new ErrorHandler("An unknown error occurred", 404));
  }
}

export default new SeoRepositorie();
