import { generateRandomId } from "../../utils/generateRandomId";
import ApiFeatures from "../../utils/apiFeatuers";
import ErrorHandler from "../../utils/ErrorHandler";
import { NextFunction } from "express";
import mongoose from "mongoose";
import Purchase_model from "../../models/primary/purchaseModel";

class PurchaseRepository {
  async create(
    data: any,
    image_data: any,
    user_id: string,
    order_details: any,
    next: NextFunction
  ) {
    const rendom_id = generateRandomId();
    // Check if data.services is defined and a valid JSON string
    let service_data: any = {};
    if (data.services && data.services !== "undefined") {
      try {
        service_data = JSON.parse(data.services);
      } catch (error) {
        return next(new ErrorHandler("Invalid services JSON format", 400));
      }
    }
    // Extract image ids into merged object
    const merged = (image_data || []).reduce(
      (acc: any, { fieldname, _id }: any) => {
        if (["image", "doket", "invoice"].includes(fieldname)) {
          acc[`${fieldname}_id`] = _id;
        }
        return acc;
      },
      {}
    );
    const purchases_number = await Purchase_model.countDocuments();

    // Build updated_data object
    const updated_data: any = {
      purchase_no: purchases_number + 1,
      purchase_id: `pur_${data.uuid}_${rendom_id}`,
      purchase_date: data.purchase_date,
      due_date: data.due_date,
      supplier_invoice_date: data.supplier_invoice_date,
      supplier_invoice_serial_no: data.supplier_invoice_serial_no,
      reference: data.reference,
      payment_mode: data.payment_mode,
      vendor: data.vendor,
      tax_status: data.tax_status,
      order_details: order_details._id,
      shipping_charges: service_data.shipping_charges || 0,
      discount: service_data.discount || 0,
      other_charge: service_data.other_charge || 0,
      notes: data.notes,
      audit_log: user_id,
    };

    // Validate and apply only if IDs are valid
    ["invoice_id", "doket_id", "image_id"].forEach((field) => {
      if (merged[field] && !mongoose.Types.ObjectId.isValid(merged[field])) {
        delete updated_data[field]; // Remove invalid IDs
      }
    });
    const validMergedFields = Object.keys(merged).filter(
      (field) => merged[field] && mongoose.Types.ObjectId.isValid(merged[field])
    );

    if (validMergedFields.length > 0) {
      validMergedFields.forEach((field) => {
        updated_data[field] = merged[field];
      });
    }

    try {
      // Save the order
      const newOrder = new Purchase_model(updated_data);

      return await newOrder.save();
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error, 404));
    }
  }

  async update(
    data: any,
    image_data: any,
    user_id: string,
    next: NextFunction
  ) {
    let service_data: any = {};

    if (data.services && data.services !== "undefined") {
      try {
        service_data = JSON.parse(data.services);
      } catch (error) {
        return next(new ErrorHandler("Invalid services JSON format", 400));
      }
    }

    // Use reduce to create merged object from image_data
    const merged = (image_data || []).reduce(
      (acc: any, { fieldname, _id }: any) => {
        if (["image", "doket", "invoice"].includes(fieldname)) {
          acc[`${fieldname}_id`] = _id;
        }
        return acc;
      },
      {}
    );

    // Build updated_data object
    const updated_data = {
      purchase_date: data.purchase_date,
      due_date: data.due_date,
      supplier_invoice_date: data.supplier_invoice_date,
      supplier_invoice_serial_no: data.supplier_invoice_serial_no,
      reference: data.reference,
      payment_mode: data.payment_mode,
      vendor: data.vendor,
      tax_status: data.tax_status,
      shipping_charges: service_data.shipping_charges || 0,
      discount: service_data.discount || 0,
      other_charge: service_data.other_charge || 0,
      notes: data.notes,
      audit_log: user_id,
    };

    try {
      const updated_order_data = await Purchase_model.findByIdAndUpdate(
        data.id,
        updated_data,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      if (!updated_order_data) {
        throw new Error("Purchase not found");
      }
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message || "An error occurred", 404));
    }
  }

  async findByName(name: any) {
    const customer = await Purchase_model.findOne({ name: name });
    return customer;
  }
  async all(query: any) {
    const resultPerPage = Number(query.rowsPerPage);
    const apiFeatures = new ApiFeatures(Purchase_model.find(), query);
    apiFeatures.search().filter().sort().pagination(resultPerPage);

    const result = await apiFeatures
      .getQuery() // Use the public getter
      .populate([
        {
          path: "vendor",
          model: "Vendor",
        },
        {
          path: "order_details",
          model: "Orders_details",
        },
        {
          path: "image_id",
          model: "Images",
        },
        {
          path: "doket_id",
          model: "Images",
        },
        {
          path: "invoice_id",
          model: "Images",
        },
        {
          path: "audit_log",
          model: "User",
        },
      ])
      .sort({ updated_at: -1 })
      .exec();

    return result;
  }

  async data_counter(query: any) {
    const apiFeatures = new ApiFeatures(Purchase_model.find(), query);
    apiFeatures.search().filter();
    const result = await apiFeatures.exec();
    return result.length;
  }
  //   async find_by_id_and_update(id: string, data: any, next: NextFunction) {
  //     const product = await Purchase_model.findById(id);

  //     if (!product) {
  //       return next(new ErrorHandler(`Product with ID ${id} not found`, 404));
  //     }
  //     product.is_active = data.state;
  //     product.is_delete = data.hard_delete;
  //     await product.save();
  //     return product;
  //   }
  async find_by_id(id: string, next: NextFunction) {
    const order = await Purchase_model.findById(id).populate([
      {
        path: "vendor",
        model: "Vendor",
      },
      {
        path: "order_details",
        model: "Orders_details",
      },
      {
        path: "image_id",
        model: "Images",
      },
      {
        path: "doket_id",
        model: "Images",
      },
      {
        path: "invoice_id",
        model: "Images",
      },
      {
        path: "audit_log",
        model: "User",
      },
    ]);

    if (!order) {
      return next(new ErrorHandler(`Order with ID ${id} not found`, 404));
    }
    return order;
  }
}
export default PurchaseRepository;
