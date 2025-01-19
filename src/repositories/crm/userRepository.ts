import { NextFunction } from "express";
import User from "../../models/primary/userModel";
import ApiFeatures from "../../utils/apiFeatuers";
import { generateRandomId } from "../../utils/generateRandomId";
import ErrorHandler from "../../utils/ErrorHandler";

class UserRepository {
  async createUser(userData: any) {
    const { email, password, name, uuid } = userData;
    const rendom_id = generateRandomId();
    const counter = await User.countDocuments();

    const data = {
      _no:counter+1,
      user_id: `user_${rendom_id}_${uuid}`,
      email,
      password,
      name,
    };
    const user = new User(data);
    return await user.save();
  }

  async findUserByEmail(email: string) {
    return await User.findOne({ email });
  }

  async findUserById(id: string) {
    return await User.findById(id);
  }

  async getAllUsers(query: any) {
    const resultPerPage = Number(query.rowsPerPage);
    const apiFeatures = new ApiFeatures(User.find(), query);
    apiFeatures.search().filter().sort().pagination(resultPerPage);

    const result = await apiFeatures
      .getQuery() // Use the public getter
      .populate([
        {
          path: "audit_log",
          model: "User",
        },
        {
          path: "images_id",
          model: "Images",
        },
      ])
      .sort({ updated_at: -1 })
      .exec();

    return result;
  }
  async data_counter(query: any) {
    const apiFeatures = new ApiFeatures(User.find(), query);
    apiFeatures.search().filter();
    const result = await apiFeatures.exec();
    return result.length;
  }

  async updateUser(id: string, updateData: any) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");
  }

  async deleteUser(id: string) {
    return await User.findByIdAndDelete(id);
  }
  async status_update(id: string, next: NextFunction) {
    try {
      const existuser = await User.findById(id);
      if (!existuser) {
        return next(new ErrorHandler("user not fount", 404));
      }
      const updated_data = {
        isActive: !existuser.isActive,
      };
      const updated_custome_data = await User.findByIdAndUpdate(
        id,
        updated_data,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
      if (!updated_custome_data) {
        return next(new ErrorHandler("User not found", 404));
      }
      return updated_custome_data;
    } catch (error: any) {
      return next(new ErrorHandler(error, 404));
    }
  }
}

export default UserRepository;
