import { NextFunction } from "express";
import ErrorHandler from "../../utils/ErrorHandler";
import { ImageUploader } from "../../utils/ImageUpload";
import ImageRepository from "../../utils/comman-repositories/imageRepository";
import ExpenseRepository from "../../repositories/crm/expenseRepository";
const imageUploader = new ImageUploader();
const add_image = new ImageRepository();

class ExpenseService {
  constructor(private expenseRepository: ExpenseRepository) {}

  async add_new_category(
    data: any,
    files: any,
    user_id: string,
    next: NextFunction
  ) {
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
    return await this.expenseRepository.create(data, image_data, user_id);
  }
  async update(data: any, files: any, user_id: string, next: NextFunction) {
    const id_exist = await this.expenseRepository.find_by_id(data.id, next);
    if (!id_exist) {
      return next(new ErrorHandler("This ID does not exist", 400));
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
    return await this.expenseRepository.update(data, image_data, user_id);
  }
  async all(query: any) {
    return await this.expenseRepository.all(query);
  }
  async data_counter(query: any) {
    return await this.expenseRepository.data_counter(query);
  }
  async find_by_id_and_update(id: string, data: any, next: NextFunction) {
    return await this.expenseRepository.find_by_id_and_update(id, data, next);
  }
  async find_by_id(id: string, next: NextFunction) {
    return await this.expenseRepository.find_by_id(id, next);
  }
}
export default ExpenseService;
