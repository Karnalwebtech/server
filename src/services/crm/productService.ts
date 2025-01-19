import { NextFunction } from "express";
import ErrorHandler from "../../utils/ErrorHandler";
import { ImageUploader } from "../../utils/ImageUpload";
import ImageRepository from "../../utils/comman-repositories/imageRepository";
import ProductRepository from "../../repositories/crm/productRepository";
const imageUploader = new ImageUploader();
const add_image = new ImageRepository();

class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async add_new_product(
    data: any,
    files: any,
    user_id: string,
    next: NextFunction
  ) {
    const existing_name = await this.productRepository.findByName(data.name);
    if (existing_name) {
      return next(
        new ErrorHandler("Product with this Name already exists", 400)
      );
    }
    const image_uploader = await imageUploader.uploadImage(files, next);
    if (!image_uploader) {
      return next(
        new ErrorHandler(
          "Something wrong image is not uploaded to the server",
          404
        )
      );
    }
    const image_data = await add_image.createImage(
      files,
      image_uploader,
      user_id,
      next
    );
    if (!image_data) {
      return next(
        new ErrorHandler(
          "Something wrong image is not added into database",
          404
        )
      );
    }
    // await FileManager.deleteFiles(files);
    return await this.productRepository.createProduct(
      data,
      image_data,
      user_id,next
    );
  }
  async update(data: any, files: any, user_id: string, next: NextFunction) {
    const id_exist = await this.productRepository.find_by_id(data.id, next);
    if (!id_exist) {
      return next(new ErrorHandler("Product ID does not exist", 400));
    }
    const existing_name = await this.productRepository.findByName(data.name);
    if (existing_name) {
      if (existing_name && existing_name.name !== id_exist.name) {
        return next(
          new ErrorHandler("Product with this Name already exists", 400)
        );
      }
    }
    let image_uploader;
    let image_data;
    if (files.length > 0) {
      image_uploader = await imageUploader.uploadImage(files, next);
      if (!image_uploader) {
        return next(
          new ErrorHandler(
            "Something wrong image is not uploaded to the server",
            404
          )
        );
      }
      image_data = await add_image.createImage(
        files,
        image_uploader,
        user_id,
        next
      );
      if (!image_data) {
        return next(
          new ErrorHandler(
            "Something wrong image is not added into database",
            404
          )
        );
      }
    }
    // await FileManager.deleteFiles(files);
    return await this.productRepository.update(data, image_data, user_id,next);
  }
  async all(query: any) {
    return await this.productRepository.all(query);
  }
  async data_counter(query: any) {
    return await this.productRepository.data_counter(query);
  }
  async find_by_id_and_update(id: string, data: any, next: NextFunction) {
    return await this.productRepository.find_by_id_and_update(id, data, next);
  }
  async find_by_id(id: string, next: NextFunction) {
    return await this.productRepository.find_by_id(id, next);
  }
}
export default ProductService;
