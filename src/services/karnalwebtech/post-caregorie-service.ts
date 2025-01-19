import { NextFunction } from "express";
import CategorieRepository from "../../repositories/karnalwebtech/post-categorie-repositories";
import { ImageUploader } from "../../utils/ImageUpload";
import ErrorHandler from "../../utils/ErrorHandler";
import ImageRepository from "../../utils/comman-repositories/imageRepository";
import seoRepositorie from "../../utils/comman-repositories/seo-repositorie";

const imageUploader = new ImageUploader();
const add_image = new ImageRepository();

class CategorieService {
  constructor(private categorieRepository: CategorieRepository) {}

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

  // Main method to create the category
  async create(data: any, files: any, user_id: string, next: NextFunction) {
    try {
      const imageResult = await this.handleImage(files, user_id, next);
      if (!imageResult) return;

      const { uploadedImage, imageData } = imageResult;

      const seo = await seoRepositorie.create(data, uploadedImage, next);
      if (!seo) {
        return this.handleError("SEO data not added to database", next);
      }

      return await this.categorieRepository.create(data, imageData, seo, user_id,next);
    } catch (error: any) {
      next(new ErrorHandler(error.message || "Internal Server Error", 500));
    }
  }

  async update(data: any, files: any, user_id: string, next: NextFunction) {
    try {
      const existingCategory = await this.categorieRepository.findBYpageid(data.id, next);
      if (!existingCategory) {
        return this.handleError("Categorie ID does not exist", next, 400);
      }

      const existingUrl = await this.categorieRepository.findBYUrl(data.metaCanonicalUrl, existingCategory._id);
      if (existingUrl) {
        return this.handleError("Categorie with this URL already exists", next, 400);
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

      return await this.categorieRepository.update(data, imageData, user_id,next);
    } catch (error: any) {
      next(new ErrorHandler(error.message || "Internal Server Error", 500));
    }
  }
  
  async findByExistUrl(url: string,next: NextFunction) {
    return await this.categorieRepository.findByExistUrl(url,next);
  }
  async findBySlug(url: string,next: NextFunction) {
    return await this.categorieRepository.findBySlug(url,next);
  }
  async all(query: any) {
    return await this.categorieRepository.all(query);
  }

  async data_counter(query: any) {
    return await this.categorieRepository.data_counter(query);
  }

  async find_by_id(id: string, next: NextFunction) {
    return await this.categorieRepository.find_by_id(id, next);
  }

  async findBYpageid(id: string, next: NextFunction) {
    return await this.categorieRepository.findBYpageid(id, next);
  }
  async removeItem(id: string, next: NextFunction) {
    return await this.categorieRepository.removeItem(id, next);
  }
}

export default CategorieService;
