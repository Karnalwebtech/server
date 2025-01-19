import { NextFunction } from "express";
import { ImageUploader } from "../../utils/ImageUpload";
import ErrorHandler from "../../utils/ErrorHandler";
import ImageRepository from "../../utils/comman-repositories/imageRepository";
import seoRepositorie from "../../utils/comman-repositories/seo-repositorie";
import PortfoliotRepository from "../../repositories/karnalwebtech/portfolio-repositories";

const imageUploader = new ImageUploader();
const add_image = new ImageRepository();

class PortfoliotService {
  constructor(private portfoliotRepository: PortfoliotRepository) {}

  // Utility function for centralized error handling
  private handleError(message: string, next: NextFunction, code: number = 404) {
    next(new ErrorHandler(message, code));
  }

  // Upload and save image with database entry
  private async handleImage(files: any, user_id: string, next: NextFunction) {
    const uploadedImage = await imageUploader.uploadImage(files, next, "karnalwebtech");
    if (!uploadedImage) {
      this.handleError("Image upload failed on the server", next);
      return null;
    }

    const imageData = await add_image.createImage(
      files,
      uploadedImage,
      user_id,
      next,
      "karnalwebtech"
    );
    if (!imageData) {
      this.handleError("Image not added to database", next);
      return null;
    }

    return { uploadedImage, imageData };
  }

  // Main method to create the post
  async create(data: any, files: any, user_id: string, next: NextFunction) {
    try {
      const imageResult = await this.handleImage(files, user_id, next);
      if (!imageResult) return;

      const { uploadedImage, imageData } = imageResult;

      const seo = await seoRepositorie.create(data, uploadedImage, next);
      if (!seo) {
        return this.handleError("SEO data not added to database", next);
      }

      return await this.portfoliotRepository.create(data, imageData, seo, user_id,next);
    } catch (error: any) {
      next(new ErrorHandler(error.message || "Internal Server Error", 500));
    }
  }

  async update(data: any, files: any, user_id: string, next: NextFunction) {
    try {
      const existingCategory = await this.portfoliotRepository.findBYpageid(data.id, next);
      if (!existingCategory) {
        return this.handleError("post ID does not exist", next, 400);
      }

      const existingUrl = await this.portfoliotRepository.findBYUrl(data.metaCanonicalUrl, existingCategory._id);
      if (existingUrl) {
        return this.handleError("post with this URL already exists", next, 400);
      }

      let imageData = null;
      if (files?.length) {
        const imageResult = await this.handleImage(files, user_id, next);
        if (!imageResult) return;

        imageData = imageResult.imageData;
      }

      const seo = await seoRepositorie.update(data, existingCategory?.seo, imageData, next);
      if (!seo) {
        return this.handleError("SEO data not added to database", next);
      }

      return await this.portfoliotRepository.update(data, imageData, user_id,next);
    } catch (error: any) {
      next(new ErrorHandler(error.message || "Internal Server Error", 500));
    }
  }

  async findByUrl(url: string) {
    return await this.portfoliotRepository.findByUrl(url);
  }

  async all(query: any) {
    return await this.portfoliotRepository.all(query);
  }

  async data_counter(query: any) {
    return await this.portfoliotRepository.data_counter(query);
  }

  async find_by_id(id: string, next: NextFunction) {
    return await this.portfoliotRepository.find_by_id(id, next);
  }

  async findBYpageid(id: string, next: NextFunction) {
    return await this.portfoliotRepository.findBYpageid(id, next);
  }
  async removeItem(id: string, next: NextFunction) {
    return await this.portfoliotRepository.removeItem(id, next);
  }
}

export default PortfoliotService;
