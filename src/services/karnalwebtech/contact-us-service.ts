import { NextFunction } from "express";
import ErrorHandler from "../../utils/ErrorHandler";
import ContactUsRepository from "../../repositories/karnalwebtech/contact-us-repositories";

class ContactUsService {
  constructor(private cortfoliotRepository: ContactUsRepository) {}
  async create(data: any, next: NextFunction) {
    const {name,description,email} = data;
    if(name === "" || description===""||email===""){
      next(new ErrorHandler("All fields are required", 400));

    }
    try {
      return await this.cortfoliotRepository.create(data, next);
    } catch (error: any) {
      next(new ErrorHandler(error.message || "Internal Server Error", 500));
    }
  }

  async update(data: any, user_id: string, next: NextFunction) {
    try {
      return await this.cortfoliotRepository.update(data, user_id, next);
    } catch (error: any) {
      next(new ErrorHandler(error.message || "Internal Server Error", 500));
    }
  }
  async all(query: any) {
    return await this.cortfoliotRepository.all(query);
  }
  async data_counter(query: any) {
    return await this.cortfoliotRepository.data_counter(query);
  }

  async find_by_id(id: string, next: NextFunction) {
    return await this.cortfoliotRepository.find_by_id(id, next);
  }

  async findBYpageid(id: string, next: NextFunction) {
    return await this.cortfoliotRepository.findBYpageid(id, next);
  }
  async removeItem(id: string, next: NextFunction) {
    return await this.cortfoliotRepository.removeItem(id, next);
  }
}

export default ContactUsService;
