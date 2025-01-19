import { NextFunction } from "express";
import ErrorHandler from "../../utils/ErrorHandler";
import CustomerRepository from "../../repositories/crm/customerRepository";

class CustomerService {
  constructor(private customerRepository: CustomerRepository) {}

  async add_new_customer(data: any, user_id: string, next: NextFunction) {
    if (data.gstin) {
      const existing_email = await this.customerRepository.findByEmail(
        data.email
      );
      if (existing_email) {
        return next(
          new ErrorHandler("Customer with this Email already exists", 400)
        );
      }
    }
    if (data.gstin) {
      const existing_gstin = await this.customerRepository.findByGstin(
        data.gstin
      );

      if (existing_gstin) {
        return next(
          new ErrorHandler("Customer with this Gstin already exists", 400)
        );
      }
    }
    return await this.customerRepository.createCustomer(data, user_id);
  }
  async update_details(data: any, user_id: string, next: NextFunction) {
    const id_exist = await this.customerRepository.find_by_id(data.id, next);
    if (!id_exist) {
      return next(new ErrorHandler("Customer ID does not exist", 400));
    }

    if (data.email) {
      const existing_email = await this.customerRepository.findByEmail(
        data.email
      );
      if (existing_email && existing_email.email !== id_exist.email) {
        return next(
          new ErrorHandler("Customer with this Email already exists", 400)
        );
      }
    }
    if (data.gstin) {
      const existingWithSameGstin = await this.customerRepository.findByGstin(
        data.gstin
      );

      if (
        existingWithSameGstin &&
        existingWithSameGstin.gstin !== id_exist.gstin
      ) {
        return next(
          new ErrorHandler("Customer with this GSTIN already exists", 400)
        );
      }
    }

    return await this.customerRepository.update_customer(data, user_id);
  }

  async all_customers(query: any) {
    return await this.customerRepository.all_customers(query);
  }
  async data_counter(query: any) {
    return await this.customerRepository.data_counter(query);
  }
  async find_by_id_and_update(id: string, data: any, next: NextFunction) {
    return await this.customerRepository.find_by_id_and_update(id, data, next);
  }
  async find_by_id(id: string, next: NextFunction) {
    return await this.customerRepository.find_by_id(id, next);
  }
}
export default CustomerService;
