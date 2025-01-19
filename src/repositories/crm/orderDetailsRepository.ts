import { NextFunction } from "express";
import ErrorHandler from "../../utils/ErrorHandler";
import Order_details_model from "../../models/primary/orderDetails";

class OrderDetailsRepository {
  async create(data: any, next: NextFunction) {
    const toNumber = (value: any) => (isNaN(Number(value)) ? 0 : Number(value));
    const counter = await Order_details_model.countDocuments();
    const updated_data: any[] = data.map((item: any) => {
      // Check if item.product exists, otherwise default to an empty object
      const product = item.product || item; // fallback to item itself if product is not defined

      return {
        product_id: product._id ? product._id : product.product_id,
        name: product.name || "",
        selling_price: product.selling_price || 0,
        primary_unit: product.primary_unit || "",
        tax: product.tax || "0",
        purchase_price: product.purchase_price || 0,
        quantity: toNumber(item.quantity),
      };
    });

    try {
      const newOrderDetails = new Order_details_model({
        _no: counter + 1,
        product_details: updated_data, // Wrap in `product_details`
      });
      return await newOrderDetails.save();
    } catch (error: any) {
      return next(new ErrorHandler(error, 404));
    }
  }
}
export default OrderDetailsRepository;
