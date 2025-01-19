import { NextFunction } from "express";
import AddressModel from "../../models/primary/addressModel";
import CustomerModel from "../../models/primary/customerModel";
import ApiFeatures from "../../utils/apiFeatuers";
import ErrorHandler from "../../utils/ErrorHandler";
import { generateRandomId } from "../../utils/generateRandomId";

class CustomerRepository {
  async createCustomer(data: any, user_id: string) {
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
    const counter = await CustomerModel.countDocuments();
    // Create vendor data object
    const updated_data = {
      _no:counter+1,
      customer_id: `customer_${uuid}_${rendom_id}`,
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
    const customer_data = new CustomerModel(updated_data);
    return await customer_data.save();
  }
  async findByGstin(gstin: string) {
    return await CustomerModel.findOne({ gstin });
  }
  async findByEmail(email: string) {
    return await CustomerModel.findOne({ email });
  }
  async update_customer(data: any, user_id: string) {
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
    const updated_data = {
        name: name,
      phone: phone,
      email: email,
      company_name: company,
      gstin: gstin,
      status,
      audit_log: user_id,
    };

    const updated_custome_data = await CustomerModel.findByIdAndUpdate(data.id, updated_data, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (!updated_custome_data) {
      throw new Error("Customer not found");
    }

    // Prepare data for billing and shipping addresses with audit_log
    const shipping_data = { ...shipping_address, audit_log: user_id };
    const billing_data = { ...billing_address, audit_log: user_id };

    // Update billing and shipping addresses in parallel if they exist
    const updateAddressPromises = [];

    if (updated_custome_data.billing_address) {
      updateAddressPromises.push(
        AddressModel.findByIdAndUpdate(updated_custome_data.billing_address, billing_data, {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        })
      );
    }

    if (updated_custome_data.shipping_address) {
      updateAddressPromises.push(
        AddressModel.findByIdAndUpdate(updated_custome_data.shipping_address, shipping_data, {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        })
      );
    }

    // Wait for all address updates to complete
    await Promise.all(updateAddressPromises);

    return updated_custome_data;
  }


  async all_customers(query: any) {
    const resultPerPage = Number(query.rowsPerPage);
    const apiFeatures = new ApiFeatures(CustomerModel.find(), query);
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
    const apiFeatures = new ApiFeatures(CustomerModel.find(), query);
    apiFeatures.search().filter();
    const result = await apiFeatures.exec();
    return result.length;
  }

  async find_by_id_and_update(
    id: string,
    data: any,
    next: NextFunction
  ) {
    const Customer = await CustomerModel.findById(id);

    if (!Customer) {
      return next(new ErrorHandler(`Customer with ID ${id} not found`, 404));
    }
    Customer.is_active = data.state;
    Customer.is_delete = data.hard_delete;
    await Customer.save();
    return Customer;
  }

  async find_by_id(id: string, next: NextFunction) {
    const customer = await CustomerModel.findById(id).populate([
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

    if (!customer) {
      return next(new ErrorHandler(`Customer with ID ${id} not found`, 404));
    }
    return customer;
  }
}

export default CustomerRepository;
