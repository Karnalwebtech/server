import { NextFunction } from "express";
import { getImageModel } from "../models-handler/image-model-handler";
import ApiFeatures from "../apiFeatuers";
import ErrorHandler from "../ErrorHandler";
import seoRepositorie from "./seo-repositorie";
import User from "../../models/primary/userModel";

class ImageRepository {
  async createImage(
    data: any,
    image_uploader: any,
    user_id: string,
    next: NextFunction,
    image_key: string = "crm"
  ) {
    try {
      // Create an array to hold image objects
      const images_arr: any[] = [];
      const counter = await getImageModel(image_key).countDocuments();
      // Check if data is an array or an object
      if (Array.isArray(data)) {
        // Handle the case when data is an array

        data.forEach((image: any, i: number) => {
          images_arr.push({
            _no: counter + 1 + i,
            fieldname: image.fieldname,
            originalname: image.originalname,
            encoding: image.encoding,
            mimetype: image.mimetype,
            destination: image.destination,
            filename: image.filename,
            path: image_uploader[i]?.url || "", // Use optional chaining to avoid errors
            size: image.size,
            audit_log: user_id,
          });
        });
      } else if (typeof data === "object" && data !== null) {
        // Handle the case when data is an object
        Object.entries(data).forEach(([key, value], entryIndex) => {
          if (Array.isArray(value)) {
            value.forEach((image: any, i: number) => {
              images_arr.push({
                _no: counter + 1 + i,
                fieldname: key,
                originalname: image.originalname,
                encoding: image.encoding,
                mimetype: image.mimetype,
                destination: image.destination,
                filename: image.filename,
                path: image_uploader[entryIndex]?.url || "", // Use optional chaining to avoid errors
                size: image.size,
                audit_log: user_id,
              });
            });
          }
        });
      } else {
        return next(new Error("Invalid data format.")); // Handle the case with invalid data format
      }

      // Insert multiple images into the database if images_arr is populated
      if (images_arr.length > 0) {
        const createdImages = await getImageModel(image_key).insertMany(
          images_arr
        ); // Insert the accumulated images array
        return createdImages; // Return saved images
      } else {
        return next(new Error("No images to insert.")); // Handle the case with no images
      }
    } catch (error) {
      next(error); // Handle the error
    }
  }
  async all(query: any, image_key: string, User: any) {
    const resultPerPage = Number(query.rowsPerPage);
    const apiFeatures = new ApiFeatures(
      getImageModel(image_key).find({ is_delete: { $ne: true } }),
      query
    );
    apiFeatures.search().filter().sort().pagination(resultPerPage);

    // Apply population and execute query
    const result = await apiFeatures
      .getQuery()
      .populate([
        { path: "audit_log", model: User },
        { path: "seo", model: "Karnal_web_seo" },
      ])
      .sort({ updated_at: -1 })
      .exec();

    return result;
  }
  async data_counter(query: any, image_key: any) {
    const apiFeatures = new ApiFeatures(
      getImageModel(image_key).find({ is_delete: { $ne: true } }),
      query
    );
    apiFeatures.search().filter();
    const result = await apiFeatures.exec();
    return result.length;
  }
  async findById(id: string, image_key: string, next: NextFunction) {
    const result = await getImageModel(image_key)
      .findOne({ _id: id })
      .populate([
        { path: "audit_log", model: User },
        { path: "seo", model: "Karnal_web_seo" },
      ]);
    if (!result) {
      return next(new ErrorHandler(`Image with ID ${id} not found`, 404));
    }
    return result;
  }
  async update(data: any, image_key: string, next: NextFunction) {
    const { title, description, alt, metaCanonicalUrl } = data;
    const isExist: any = await getImageModel(image_key)
      .findOne({
        _id: data?.id,
      })
      .populate("seo");
    if (!isExist) {
      return next(new ErrorHandler(`Image with ID ${data?.id} not found`, 404));
    }

    let seo = null;
    if (isExist?.seo?._id) {
      seo = await seoRepositorie.update(data, isExist.seo, [], next); // Pass an empty array for imageData if not available
    } else {
      seo = await seoRepositorie.create(data, [], next, metaCanonicalUrl); // Fallback image_uploader to empty array
    }
    if (!seo?._id) {
      return next(new ErrorHandler("SEO data not updated", 400)); // Ensure SEO was created or updated successfully
    }
    const updated_data = {
      title,
      caption: description,
      altText: alt,
      seo: seo?._id,
    };

    const result = await getImageModel(image_key).findByIdAndUpdate(
      { _id: data?.id },
      updated_data,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    if (!result) {
      return next(new ErrorHandler("Data not updated", 404));
    }
    return result;
  }

  async updateImage(
    image_ids: any,
    key: string,
    oldImageId: any,
    updateData: any,
    next: NextFunction
  ) {
    try {
      const ImageModel = getImageModel(key);
      // Update old image if it exists
      if (oldImageId) {
        await ImageModel.findByIdAndUpdate(oldImageId, updateData, {
          new: true,
        });
      }

      if (Array.isArray(image_ids)) {
        // Deactivate the old image if not in the new image list
        if (!image_ids.includes(oldImageId) && oldImageId) {
          await ImageModel.findByIdAndUpdate(
            oldImageId,
            { is_active: false },
            { new: true }
          );
        }

        // Activate the new images
        const imageUpdatePromises = image_ids.map((id: any) =>
          ImageModel.findByIdAndUpdate(id, updateData, { new: true })
        );
        await Promise.all(imageUpdatePromises);
      }
    } catch (error: any) {
      console.error(`Error updating images: ${error.message}`);
      return next(
        new ErrorHandler(`Error updating images: ${error.message}`, 500)
      );
    }
  }
}

export default ImageRepository;
