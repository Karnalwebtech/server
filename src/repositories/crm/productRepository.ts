import { generateRandomId } from "../../utils/generateRandomId";
import Product_model from "../../models/primary/productModel";
import ApiFeatures from "../../utils/apiFeatuers";
import ErrorHandler from "../../utils/ErrorHandler";
import { NextFunction } from "express";
import mongoose from "mongoose";

class ProductRepository {
  async createProduct(
    data: any,
    image_data: any,
    user_id: string,
    next: NextFunction
  ) {
    const rendom_id = generateRandomId();

    const toNumber = (value: any) => (isNaN(Number(value)) ? 0 : Number(value));

    // Destructure and prepare image ids
    const image_ids = image_data.map((item: any) => item._id);
    const counter = await Product_model.countDocuments();
    const updated_data: any = {
      _no: counter + 1,
      prod_id: `prod_${data.uuid}_${rendom_id}`,
      name: data.name,
      status: data.status,
      selling_price: toNumber(data.selling_price),
      tax: data.tax,
      primary_unit: data.primary_unit,
      sku: data.sku,
      hsn: data.hsn,
      purchase_price: toNumber(data.purchase_price),
      total_quantity: toNumber(data.total_quantity),
      barcode: data.barcode,
      weight: toNumber(data.weight),
      depth: toNumber(data.depth),
      width: toNumber(data.width),
      height: toNumber(data.height),
      images_id: image_ids,
      audit_log: user_id,
    };

    if (data.categorie && mongoose.Types.ObjectId.isValid(data.categorie)) {
      updated_data.categorie = data.categorie;
    }

    try {
      const Product = new Product_model(updated_data);
      return await Product.save();
    } catch (error: any) {
      return next(new ErrorHandler(error, 404));
    }
  }
  async update(
    data: any,
    image_data: any,
    user_id: string,
    next: NextFunction
  ) {
    const toNumber = (value: any) => (isNaN(Number(value)) ? 0 : Number(value));

    const image_ids =
      Array.isArray(image_data) && image_data.length > 0
        ? image_data.map((item: any) => item._id)
        : [];

    const updated_data: any = {
      name: data.name,
      status: data.status,
      selling_price: toNumber(data.selling_price),
      tax: data.tax,
      primary_unit: data.primary_unit,
      sku: data.sku,
      hsn: data.hsn,
      purchase_price: toNumber(data.purchase_price),
      total_quantity: toNumber(data.total_quantity),
      barcode: data.barcode,
      weight: toNumber(data.weight),
      depth: toNumber(data.depth),
      width: toNumber(data.width),
      height: toNumber(data.height),
      images_id: image_ids.length > 0 ? image_ids : data.images && data.images,
      audit_log: user_id,
    };
    if (data.categorie && mongoose.Types.ObjectId.isValid(data.categorie)) {
      updated_data.categorie = data.categorie;
    }
    try {
      const updated_custome_data = await Product_model.findByIdAndUpdate(
        data.id,
        updated_data,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
      if (!updated_custome_data) {
        return next(new ErrorHandler("Product not found", 404));
      }
      return updated_custome_data
    } catch (error: any) {
      return next(new ErrorHandler(error, 404));
    }
  }
  async findByName(name: any) {
    const customer = await Product_model.findOne({ name: name });
    return customer;
  }
  async all(query: any) {
    const resultPerPage = Number(query.rowsPerPage);
    const apiFeatures = new ApiFeatures(Product_model.find(), query);
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
        {
          path: "categorie",
          model: "Categorie",
        },
      ])
      .sort({ updated_at: -1 })
      .exec();

    return result;
  }

  async data_counter(query: any) {
    const apiFeatures = new ApiFeatures(Product_model.find(), query);
    apiFeatures.search().filter();
    const result = await apiFeatures.exec();
    return result.length;
  }
  async find_by_id_and_update(id: string, data: any, next: NextFunction) {
    const product = await Product_model.findById(id);

    if (!product) {
      return next(new ErrorHandler(`Product with ID ${id} not found`, 404));
    }
    product.is_active = data.state;
    product.is_delete = data.hard_delete;
    await product.save();
    return product;
  }
  async find_by_id(id: string, next: NextFunction) {
    const product = await Product_model.findById(id).populate([
      {
        path: "audit_log",
        model: "User",
      },
      {
        path: "images_id",
        model: "Images",
      },
      {
        path: "categorie",
        model: "Categorie",
      },
    ]);

    if (!product) {
      return next(new ErrorHandler(`Product with ID ${id} not found`, 404));
    }
    return product;
  }
}
export default ProductRepository;
