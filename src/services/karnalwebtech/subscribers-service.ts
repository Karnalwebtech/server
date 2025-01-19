import { NextFunction } from "express";
import ErrorHandler from "../../utils/ErrorHandler";
import SubscribersRepository from "../../repositories/karnalwebtech/subscribers-repositories";

class SubscribersService {
  constructor(private subscribersRepository: SubscribersRepository) {}
  async create(data: any, next: NextFunction) {
    const { email } = data;
    if (email === "") {
      next(new ErrorHandler("fields are required", 400));
    }
    try {
      const isExist = await this.subscribersRepository.find_by_email(email);
      if (isExist) {
        return true;
      }
      return await this.subscribersRepository.create(data, next);
    } catch (error: any) {
      next(new ErrorHandler(error.message || "Internal Server Error", 500));
    }
  }
  async all(query: any) {
    return await this.subscribersRepository.all(query);
  }
  async data_counter(query: any) {
    return await this.subscribersRepository.data_counter(query);
  }

  async find_by_id(id: string, next: NextFunction) {
    return await this.subscribersRepository.find_by_id(id, next);
  }

  async findBYpageid(id: string, next: NextFunction) {
    return await this.subscribersRepository.findBYpageid(id, next);
  }
  async removeItem(id: string, next: NextFunction) {
    return await this.subscribersRepository.removeItem(id, next);
  }
}

export default SubscribersService;
