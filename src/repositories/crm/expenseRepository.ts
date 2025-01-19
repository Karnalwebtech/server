import { NextFunction } from "express";
import { generateRandomId } from "../../utils/generateRandomId";
import ApiFeatures from "../../utils/apiFeatuers";
import ErrorHandler from "../../utils/ErrorHandler";
import Expenses_model from "../../models/primary/expenseModel";

const toNumber = (value: any) => (isNaN(Number(value)) ? 0 : Number(value));
class ExpenseRepository {
  async create(data: any, image_data: any, user_id: string) {
    const rendom_id = generateRandomId();
    const {
      name,
      description,
      uuid,
      payment_type,
      categorie,
      payment_mode,
      notes,
      amount,
    } = data;
    const image_ids =
      Array.isArray(image_data) && image_data.length > 0
        ? image_data.map((item: any) => item._id)
        : [];
    const counter = await Expenses_model.countDocuments();
    const updated_data = {
      _no: counter + 1,
      expense_id: `Expence${uuid}_${rendom_id}`,
      name,
      description,
      categorie,
      payment_type,
      payment_mode,
      notes,
      amount: toNumber(amount),
      images_id: image_ids,
      audit_log: user_id,
    };
    const model = new Expenses_model(updated_data);
    return await model.save();
  }
  async update(data: any, image_data: any, user_id: string) {
    const {
      name,
      description,
      categorie,
      payment_type,
      payment_mode,
      notes,
      amount,
      images,
    } = data;
    const image_ids =
      Array.isArray(image_data) && image_data.length > 0
        ? image_data.map((item: any) => item._id)
        : [];

    const updated_data = {
      name,
      description,
      categorie,
      payment_mode,
      payment_type,
      notes,
      amount: toNumber(amount),
      images_id: image_ids.length > 0 ? image_ids : images,
      audit_log: user_id,
    };
    const updated_custome_data = await Expenses_model.findByIdAndUpdate(
      data.id,
      updated_data,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    if (!updated_custome_data) {
      throw new Error("Data not found");
    }
    return updated_custome_data;
  }
  async findByName(name: any) {
    const customer = await Expenses_model.findOne({ name: name });
    return customer;
  }
  async all(query: any) {
    const resultPerPage = Number(query.rowsPerPage);
    const apiFeatures = new ApiFeatures(Expenses_model.find(), query);
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
    const apiFeatures = new ApiFeatures(Expenses_model.find(), query);
    apiFeatures.search().filter();
    const result = await apiFeatures.exec();
    return result.length;
  }
  async find_by_id_and_update(id: string, data: any, next: NextFunction) {
    const result = await Expenses_model.findById(id);

    if (!result) {
      return next(new ErrorHandler(`This ID ${id} not found`, 404));
    }
    result.is_active = data.state;
    result.is_delete = data.hard_delete;
    await result.save();
    return result;
  }
  async find_by_id(id: string, next: NextFunction) {
    const result = await Expenses_model.findById(id).populate([
      {
        path: "audit_log",
        model: "User",
      },
      {
        path: "images_id",
        model: "Images",
      },
    ]);

    if (!result) {
      return next(new ErrorHandler(`This ID ${id} not found`, 404));
    }
    return result;
  }
}
export default ExpenseRepository;
