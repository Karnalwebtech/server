import { generateRandomId } from "../../utils/generateRandomId";
import Product_model from "../../models/primary/productModel";
import ApiFeatures from "../../utils/apiFeatuers";
import ErrorHandler from "../../utils/ErrorHandler";
import { NextFunction } from "express";
import mongoose from "mongoose";
import Order_model from "../../models/primary/orderModel";
import AddressModel from "../../models/primary/addressModel";

class OrderRepository {
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
    const parse_shipping = JSON.parse(data.shipping_address);
    const shipping_data = { ...parse_shipping, audit_log: user_id };
    const [shipping_a] = await Promise.all([
      AddressModel.create(shipping_data),
    ]);
    const order_number = await Order_model.countDocuments();

    // Build updated_data object
    const updated_data: any = {
      order_no: order_number + 1,
      order_id: `ord_${data.uuid}_${rendom_id}`,
      order_date: new Date(),
      order_status: data.order_status,
      tax_status: data.tax_status,
      customer: data.customer,
      dispatch_mod: data.dispatch_mod,
      invoice_no: data.invoice_no,
      payment_mode: data.payment_mode,
      name: data.name,
      shipping_charges: service_data.shipping_charges || 0,
      discount: service_data.discount || 0,
      other_charge: service_data.other_charge || 0,
      order_details: order_details._id,
      shipping_address: shipping_a._id,
      company: data.company,
      email: data.email,
      notes: data.notes,
      phone: data.phone,
      gstin: data.gstin,
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
      await updateOrderStatus(
        "create",
        data.order_status,
        "mome",
        order_details,
        user_id
      );

      // Save the order
      const newOrder = new Order_model(updated_data);

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
    order_details: any,
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

    const parse_shipping = JSON.parse(data.shipping_address);
    const shipping_data = { ...parse_shipping, audit_log: user_id };

    const [shipping_a] = await Promise.all([
      AddressModel.create(shipping_data),
    ]);

    // Build updated_data object
    const updated_data = {
      order_status: data.order_status,
      customer: data.customer,
      dispatch_mod: data.dispatch_mod,
      tax_status: data.tax_status,
      invoice_no: data.invoice_no,
      payment_mode: data.payment_mode,
      name: data.name,
      shipping_charges: service_data.shipping_charges || 0,
      discount: service_data.discount || 0,
      other_charge: service_data.other_charge || 0,
      order_details: order_details._id,
      shipping_address: shipping_a._id,
      company: data.company,
      email: data.email,
      notes: data.notes,
      phone: data.phone,
      gstin: data.gstin,
      audit_log: user_id,
      invoice_id: merged.invoice_id || data.invoice,
      doket_id: merged.doket_id || data.doket,
      image_id: merged.image_id || data.image,
    };

    try {
      const before_order_status = await Order_model.findOne({ _id: data.id });
      if (before_order_status) {
        await updateOrderStatus(
          "update",
          data.order_status,
          before_order_status.order_status,
          order_details,
          user_id
        );
      }

      const updated_order_data = await Order_model.findByIdAndUpdate(
        data.id,
        updated_data,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      if (!updated_order_data) {
        throw new Error("Customer not found");
      }
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message || "An error occurred", 404));
    }
  }

  async findByName(name: any) {
    const customer = await Product_model.findOne({ name: name });
    return customer;
  }
  async all(query: any) {
    const resultPerPage = Number(query.rowsPerPage);
    const apiFeatures = new ApiFeatures(Order_model.find(), query);
    apiFeatures.search().filter().sort().pagination(resultPerPage);

    const result = await apiFeatures
      .getQuery() // Use the public getter
      .populate([
        {
          path: "customer",
          model: "Customer",
        },
        {
          path: "shipping_address",
          model: "Address",
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
    const apiFeatures = new ApiFeatures(Order_model.find(), query);
    apiFeatures.search().filter();
    const result = await apiFeatures.exec();
    return result.length;
  }
  //   async find_by_id_and_update(id: string, data: any, next: NextFunction) {
  //     const product = await Product_model.findById(id);

  //     if (!product) {
  //       return next(new ErrorHandler(`Product with ID ${id} not found`, 404));
  //     }
  //     product.is_active = data.state;
  //     product.is_delete = data.hard_delete;
  //     await product.save();
  //     return product;
  //   }
  async find_by_id(id: string, next: NextFunction) {
    const order = await Order_model.findById(id).populate([
      {
        path: "customer",
        model: "Customer",
      },
      {
        path: "shipping_address",
        model: "Address",
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
export default OrderRepository;

async function updateOrderStatus(
  type: string,
  status: string,
  order_status: string,
  order_details: any,
  user_id: string
) {
  switch (status) {
    case "processing":
      await processOrder(order_status, order_details, user_id);
      break;
    // case "delivered":
    //   await handleDelivered(order_status, order_details, user_id);
    //   break;
    case "canceled":
      await handleCanceled(type, status, order_status, order_details, user_id);
      break;
    case "refund":
      await handleRefund(type, status, order_status, order_details, user_id);
      break;
    case "return":
      await handleReturn(type, status, order_status, order_details, user_id);
      break;
    case "hold":
      await handleHold(order_status, order_details, user_id);
      break;
    default:
      return;
  }
}

// Function to process the order
async function processOrder(
  order_status: string,
  order_details: any,
  user_id: string
) {
  if (order_status === "processing") return;
  const productUpdates = order_details.product_details.map(
    async ({ product_id, quantity }: any) => {
      return Product_model.findOneAndUpdate(
        { _id: product_id },
        { $inc: { total_quantity: -quantity } }, // Decrease total_quantity
        { new: true }
      );
    }
  );
  await Promise.all(productUpdates);
  console.log(`Order is being processed by user ${user_id}`);
}

// Function for handling delivered orders
async function handleDelivered(
  order_status: string,
  order_details: any,
  user_id: string
) {
  // You can add custom logic for a delivered order
  console.log(`Order delivered by user ${user_id}`);
}

// Function for handling canceled orders
async function handleCanceled(
  type: string,
  status: string,
  order_status: string,
  order_details: any,
  user_id: string
) {
  if (
    type === "create" ||
    order_status === "canceled" ||
    order_status === "returned" ||
    order_status === "refund"
  ) {
    return;
  }

  const productUpdates = order_details.product_details.map(
    async ({ product_id, quantity }: any) => {
      return Product_model.findOneAndUpdate(
        { _id: product_id },
        { $inc: { total_quantity: quantity } }, // Restore total_quantity
        { new: true }
      );
    }
  );
  await Promise.all(productUpdates);
  console.log(`Order canceled by user ${user_id}`);
}

// Function for handling refunds
async function handleRefund(
  type: string,
  status: string,
  order_status: string,
  order_details: any,
  user_id: string
) {
  if (
    type === "create" ||
    order_status === "refund" ||
    order_status === "canceled" ||
    order_status === "returned" 
  ) {
    return;
  }

  const productUpdates = order_details.product_details.map(
    async ({ product_id, quantity }: any) => {
      return Product_model.findOneAndUpdate(
        { _id: product_id },
        { $inc: { total_quantity: quantity } }, // Restore total_quantity
        { new: true }
      );
    }
  );
  await Promise.all(productUpdates);
  console.log(`Order canceled by user ${user_id}`);
}

// Function for handling returns
async function handleReturn(
  type: string,
  status: string,
  order_status: string,
  order_details: any,
  user_id: string
) {
  if (
    type === "create" ||
    order_status === "refund" ||
    order_status === "canceled" ||
    order_status === "returned"
  ) {
    return;
  }

  const productUpdates = order_details.product_details.map(
    async ({ product_id, quantity }: any) => {
      return Product_model.findOneAndUpdate(
        { _id: product_id },
        { $inc: { total_quantity: quantity } }, // Restore total_quantity
        { new: true }
      );
    }
  );
  await Promise.all(productUpdates);
  console.log(`Order returned by user ${user_id}`);
}

// Function for handling hold orders
async function handleHold(
  order_status: string,
  order_details: any,
  user_id: string
) {
  // Simply hold the order and prevent further changes
  console.log(`Order placed on hold by user ${user_id}`);
}
