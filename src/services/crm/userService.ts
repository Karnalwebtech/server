import { NextFunction } from "express";
import ErrorHandler from "../../utils/ErrorHandler";
import UserRepository from "../../repositories/crm/userRepository";

class UserService {
  constructor(private userRepository: UserRepository) {}

  async registerUser(userData: any, next: NextFunction) {
    const existingUser = await this.userRepository.findUserByEmail(
      userData.email
    );

    if (existingUser) {
      return next(new ErrorHandler("User with this email already exists", 400));
    }
    return await this.userRepository.createUser(userData);
  }

  async authenticateUser(email: string, password: string, next: NextFunction) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }
    const isActive = user.isActive; // Access isActive only if existingUser is not null
    if (!isActive) {
      return next(
        new ErrorHandler(
          `${user.email} you are not authorized, contact to admin`,
          404
        )
      );
    }
    return user;
  }

  async getAllUsers(query: any) {
    return await this.userRepository.getAllUsers(query);
  }
  async data_counter(query: any) {
    return await this.userRepository.data_counter(query);
  }
  async getUserById(id: string) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateUser(id: string, updateData: any) {
    return await this.userRepository.updateUser(id, updateData);
  }

  async deleteUser(id: string) {
    return await this.userRepository.deleteUser(id);
  }
  async status_update(id: string,next:NextFunction) {
    return await this.userRepository.status_update(id,next);
  }
  
}

export default UserService;
