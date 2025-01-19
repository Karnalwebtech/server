import { NextFunction } from "express";
import { ImageUploader } from "../../utils/ImageUpload";
import ErrorHandler from "../../utils/ErrorHandler";
import ImageRepository from "../../utils/comman-repositories/imageRepository";
import seoRepositorie from "../../utils/comman-repositories/seo-repositorie";
import PostRepository from "../../repositories/karnalwebtech/post-repositories";

const imageUploader = new ImageUploader();
const add_image = new ImageRepository();

class PostService {
  constructor(private PostRepository: PostRepository) {}

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

      return await this.PostRepository.create(data, imageData, seo, user_id,next);
    } catch (error: any) {
      next(new ErrorHandler(error.message || "Internal Server Error", 500));
    }
  }

  async update(data: any, files: any, user_id: string, next: NextFunction) {
    try {
      const existingCategory = await this.PostRepository.findBYpageid(data.id, next);
      if (!existingCategory) {
        return this.handleError("post ID does not exist", next, 400);
      }

      const existingUrl = await this.PostRepository.findBYUrl(data.metaCanonicalUrl, existingCategory._id);
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

      return await this.PostRepository.update(data, imageData, user_id,next);
    } catch (error: any) {
      next(new ErrorHandler(error.message || "Internal Server Error", 500));
    }
  }

  async findByUrl(url: string) {
    return await this.PostRepository.findByUrl(url);
  }

  async all(query: any) {
    return await this.PostRepository.all(query);
  }

  async data_counter(query: any) {
    return await this.PostRepository.data_counter(query);
  }

  async find_by_id(id: string, next: NextFunction) {
    return await this.PostRepository.find_by_id(id, next);
  }

  async findBYpageid(id: string, next: NextFunction) {
    return await this.PostRepository.findBYpageid(id, next);
  }
  
  async findBYSlug(id: string, next: NextFunction) {
    return await this.PostRepository.findBYSlug(id, next);
  }
  async removeItem(id: string, next: NextFunction) {
    return await this.PostRepository.removeItem(id, next);
  }
}

export default PostService;
