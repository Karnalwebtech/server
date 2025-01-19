import { NextFunction } from "express";
import VendorModel from "../../models/primary/vendorModel";
import ApiFeatures from "../../utils/apiFeatuers";
import { generateRandomId } from "../../utils/generateRandomId";
import ErrorHandler from "../../utils/ErrorHandler";
import AddressModel from "../../models/primary/addressModel";

class VendorRepository {
  async createVendor(data: any, user_id: any) {
    const rendom_id = generateRandomId();

    const {
      shipping_address,
      billing_address,
      status,
      name,
      phone,
      email,
      company,
      gstin,
      uuid,
    } = data;

    // Add audit_log to both shipping and billing addresses
    const shipping_data = { ...shipping_address, audit_log: user_id };
    const billing_data = { ...billing_address, audit_log: user_id };

    // Create billing and shipping addresses concurrently
    const [billing_a, shipping_a] = await Promise.all([
      AddressModel.create(billing_data),
      AddressModel.create(shipping_data),
    ]);
    const counter = await VendorModel.countDocuments();
    // Create vendor data object
    const vendor_data = {
      _no:counter+1,
      vendor_id: `vendor_${uuid}_${rendom_id}`,
      name: name,
      phone,
      email,
      company_name: company,
      gstin,
      billing_address: billing_a,
      shipping_address: shipping_a,
      status,
      audit_log: user_id,
    };

    // Save the vendor and return the result
    const vendor = new VendorModel(vendor_data);
    return await vendor.save();
  }

  async update_vendor(data: any, user_id: string) {
    const {
      name,
      phone,
      email,
      company,
      gstin,
      billing_address,
      status,
      shipping_address,
    } = data;

    // Prepare the updated vendor data
    const vendor_data = {
      name: name,
      phone: phone,
      email: email,
      company_name: company,
      gstin: gstin,
      status,
      audit_log: user_id,
    };

    // Update the vendor information
    const vendor = await VendorModel.findByIdAndUpdate(data.id, vendor_data, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    // Throw an error if the vendor is not found
    if (!vendor) {
      throw new Error("Vendor not found");
    }

    // Prepare data for billing and shipping addresses with audit_log
    const shipping_data = { ...shipping_address, audit_log: user_id };
    const billing_data = { ...billing_address, audit_log: user_id };

    // Update billing and shipping addresses in parallel if they exist
    const updateAddressPromises = [];

    if (vendor.billing_address) {
      updateAddressPromises.push(
        AddressModel.findByIdAndUpdate(vendor.billing_address, billing_data, {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        })
      );
    }

    if (vendor.shipping_address) {
      updateAddressPromises.push(
        AddressModel.findByIdAndUpdate(vendor.shipping_address, shipping_data, {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        })
      );
    }

    // Wait for all address updates to complete
    await Promise.all(updateAddressPromises);

    return vendor;
  }

  async findByGstin(gstin: string) {
    return await VendorModel.findOne({ gstin });
  }
  async findByEmail(email: string) {
    return await VendorModel.findOne({ email });
  }

  async all_vendors(query: any) {
    const resultPerPage = Number(query.rowsPerPage);
    const apiFeatures = new ApiFeatures(VendorModel.find(), query);
    apiFeatures.search().filter().sort().pagination(resultPerPage);

    const result = await apiFeatures
      .getQuery() // Use the public getter
      .populate([
        {
          path: "audit_log",
          model: "User",
        },
        {
          path: "shipping_address",
          model: "Address",
        },
        {
          path: "billing_address",
          model: "Address",
        },
      ])
      .sort({ updated_at: -1 })
      .exec();

    return result;
  }

  async data_counter(query: any) {
    const apiFeatures = new ApiFeatures(VendorModel.find(), query);
    apiFeatures.search().filter();
    const result = await apiFeatures.exec();
    return result.length;
  }

  async find_by_vendor_id_and_update(
    id: string,
    data: any,
    next: NextFunction
  ) {
    const vendor = await VendorModel.findById(id);

    if (!vendor) {
      return next(new ErrorHandler(`Vendor with ID ${id} not found`, 404));
    }
    vendor.is_active = data.state;
    vendor.is_delete = data.hard_delete;
    await vendor.save();
    return vendor;
  }

  async find_by_vendor_id(id: string, next: NextFunction) {
    const vendor = await VendorModel.findById(id).populate([
      {
        path: "audit_log",
        model: "User",
      },
      {
        path: "shipping_address",
        model: "Address",
      },
      {
        path: "billing_address",
        model: "Address",
      },
    ]);

    if (!vendor) {
      return next(new ErrorHandler(`Vendor with ID ${id} not found`, 404));
    }
    return vendor;
  }
}
export default VendorRepository;
