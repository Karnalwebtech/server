import { NextFunction } from "express";
import Categorie_model from "../../models/primary/categorieModel";
import { generateRandomId } from "../../utils/generateRandomId";
import ApiFeatures from "../../utils/apiFeatuers";
import ErrorHandler from "../../utils/ErrorHandler";

class CategorieRepository {
  async createCategorie(data: any, image_data: any, user_id: string) {
    const rendom_id = generateRandomId();
    const { name, description, uuid, status } = data;
    const image_ids = image_data.map((item: any) => item._id);
    const counter = await Categorie_model.countDocuments();

    const updated_data = {
      _no:counter+1,
      cat_id: `cat_${uuid}_${rendom_id}`,
      name,
      description,
      status,
      images_id: image_ids,
      audit_log: user_id,
    };
    const Categorie = new Categorie_model(updated_data);
    return await Categorie.save();
  }
  async update(data: any, image_data: any, user_id: string) {
    const { name, description, images, status } = data;
    const image_ids =
      Array.isArray(image_data) && image_data.length > 0
        ? image_data.map((item: any) => item._id)
        : [];

    const updated_data = {
      name,
      description,
      status,
      images_id: image_ids.length > 0 ? image_ids : images,
      audit_log: user_id,
    };
    const updated_custome_data = await Categorie_model.findByIdAndUpdate(
      data.id,
      updated_data,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    if (!updated_custome_data) {
      throw new Error("Categorie not found");
    }
    return updated_custome_data;
  }
  async findByName(name: any) {
    const customer = await Categorie_model.findOne({ name: name });
    return customer;
  }
  async all_categorie(query: any) {
    const resultPerPage = Number(query.rowsPerPage);
    const apiFeatures = new ApiFeatures(Categorie_model.find(), query);
    apiFeatures.search().filter().sort().pagination(resultPerPage);

    const result = await apiFeatures
      .getQuery() // Use the public getter
      .populate([
        {
          path: "audit_log",
          model: "User",
        },
        {
          path: "images_id",
          model: "Images",
        },
      ])
      .sort({ updated_at: -1 })
      .exec();

    return result;
  }

  async data_counter(query: any) {
    const apiFeatures = new ApiFeatures(Categorie_model.find(), query);
    apiFeatures.search().filter();
    const result = await apiFeatures.exec();
    return result.length;
  }
  async find_by_id_and_update(id: string, data: any, next: NextFunction) {
    const Category = await Categorie_model.findById(id);

    if (!Category) {
      return next(new ErrorHandler(`Category with ID ${id} not found`, 404));
    }
    Category.is_active = data.state;
    Category.is_delete = data.hard_delete;
    await Category.save();
    return Category;
  }
  async find_by_id(id: string, next: NextFunction) {
    const Category = await Categorie_model.findById(id).populate([
      {
        path: "audit_log",
        model: "User",
      },
      {
        path: "images_id",
        model: "Images",
      },
    ]);

    if (!Category) {
      return next(new ErrorHandler(`Category with ID ${id} not found`, 404));
    }
    return Category;
  }
}
export default CategorieRepository;
