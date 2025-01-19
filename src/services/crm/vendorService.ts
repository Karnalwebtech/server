import { NextFunction } from "express";
import VendorRepository from "../../repositories/crm/vendorRepository";
import ErrorHandler from "../../utils/ErrorHandler";

class VendorService {
  constructor(private vendorRepository: VendorRepository) {}

  async add_new_vendor(vendordata: any, user_id: string, next: NextFunction) {
    if (vendordata.email) {
      const existing_email = await this.vendorRepository.findByEmail(
        vendordata.email
      );
      if (existing_email)
        return next(
          new ErrorHandler("Vendor with this Email already exists", 400)
        );
    }
    if (vendordata.gstin) {
      const existing_gstin = await this.vendorRepository.findByGstin(
        vendordata.gstin
      );
      if (vendordata.gstin.length !== 15) {
        return next(new ErrorHandler("GSTIN must be 15 characters long", 400));
      }

      if (existing_gstin) {
        return next(
          new ErrorHandler("Vendor with this Gstin already exists", 400)
        );
      }
    }

    return await this.vendorRepository.createVendor(vendordata, user_id);
  }
  async update_details(vendordata: any, user_id: string, next: NextFunction) {
    const id_exist = await this.vendorRepository.find_by_vendor_id(
      vendordata.id,
      next
    );
    if (!id_exist) {
      return next(new ErrorHandler("Vendor ID does not exist", 400));
    }
    if (vendordata.email) {
      const existing_email = await this.vendorRepository.findByEmail(
        vendordata.email
      );
      if (existing_email && existing_email.email !== id_exist.email) {
        return next(
          new ErrorHandler("Vendor with this Email already exists", 400)
        );
      }
    }
    if (vendordata.gstin) {
      const existingVendorWithSameGstin =
        await this.vendorRepository.findByGstin(vendordata.gstin);

      if (
        existingVendorWithSameGstin &&
        existingVendorWithSameGstin.gstin !== id_exist.gstin
      ) {
        return next(
          new ErrorHandler("Vendor with this GSTIN already exists", 400)
        );
      }
    }

    // if (
    //   isNaN(vendordata.pin_code) ||
    //   vendordata.pin_code < 100000 ||
    //   vendordata.pin_code > 999999
    // ) {
    //   return next(
    //     new ErrorHandler("Pincode must be a valid 6-digit number.", 400)
    //   );
    // }

    return await this.vendorRepository.update_vendor(vendordata, user_id);
  }

  async all_vendors(query: any) {
    return await this.vendorRepository.all_vendors(query);
  }
  async data_counter(query: any) {
    return await this.vendorRepository.data_counter(query);
  }
  async find_by_vendor_id_and_update(
    id: string,
    data: any,
    next: NextFunction
  ) {
    return await this.vendorRepository.find_by_vendor_id_and_update(
      id,
      data,
      next
    );
  }
  async find_by_vendor_id(id: string, next: NextFunction) {
    return await this.vendorRepository.find_by_vendor_id(id, next);
  }
}
export default VendorService;
