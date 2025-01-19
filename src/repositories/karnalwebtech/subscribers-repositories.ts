import { NextFunction } from "express";
import User from "../../models/primary/userModel";
import ApiFeatures from "../../utils/apiFeatuers";
import ErrorHandler from "../../utils/ErrorHandler";
import { generateRandomId } from "../../utils/generateRandomId";
import subscribersModel from "../../models/karnalwebtech/subscribers";

class SubscribersRepository {
  // Reusable function to generate unique post ID
  private generatePostId(
    uuid: string,
    randomId: string,
    number: number
  ): string {
    return `susb_${randomId.toLowerCase()}_${uuid}${number}`;
  }

  // Reusable function to get the next post number
  private async getNextNumber(): Promise<number> {
    const count = await subscribersModel.countDocuments();
    return count + 1;
  }

  // Helper function for populating category data
  private async populateData(query: any) {
    return query.populate([{ path: "audit_log", model: User }]);
  }

  // Create a new post
  async create(data: any, next: NextFunction) {
    try {
      const randomId = generateRandomId();
      const { uuid, email } = data;

      // Get next post number
      const contactNumber = await this.getNextNumber();

      // Generate post ID
      const catId = this.generatePostId(uuid, randomId, contactNumber);

      // Prepare data to be saved
      const newData = {
        _no: contactNumber,
        email,
        susb_id: catId,
      };
      const result = new subscribersModel(newData);
      return await result.save();
    } catch (error: any) {
      throw new Error(`Error creating subscribers us: ${error.message}`);
    }
  }

  // Retrieve all post with filters and pagination
  async all(query: any) {
    const resultPerPage = Number(query.rowsPerPage);
    const apiFeatures = new ApiFeatures(
      subscribersModel.find({ is_delete: { $ne: true } }),
      query
    );
    apiFeatures.search().filter().sort().pagination(resultPerPage);

    // Apply population and execute query
    const result = await apiFeatures
      .getQuery()
      .populate([{ path: "audit_log", model: User }])
      .sort({ updated_at: -1 })
      .exec();
    return result;
  }

  // Get the total count of [pst] based on filters
  async data_counter(query: any) {
    const apiFeatures = new ApiFeatures(
      subscribersModel.find({ is_delete: { $ne: true } }),
      query
    );
    apiFeatures.search().filter();
    const result = await apiFeatures.exec();
    return result.length;
  }

  // Find portfolio by ID
  async find_by_id(id: string, next: NextFunction) {
    const result = await this.populateData(subscribersModel.findById(id));
    if (!result) {
      return next(new ErrorHandler(`portfolio with ID ${id} not found`, 404));
    }
    return result;
  }
  // Find by email
  async find_by_email(email: string) {
    const result = await this.populateData(subscribersModel.findOne({ email }));
    return result;
  }

  // Find post by page ID
  async findBYpageid(id: string, next: NextFunction) {
    const result = await this.populateData(
      subscribersModel.findOne({ susb_id: id })
    );

    if (!result) {
      return next(new ErrorHandler(`Subscriber with ID ${id} not found`, 404));
    }
    return result;
  }
  async removeItem(id: string, next: NextFunction) {
    const result = await this.populateData(
      subscribersModel.findOne({ susb_id: id })
    );

    if (!result) {
      return next(new ErrorHandler(`Subscriber with ID ${id} not found`, 404));
    }
    result.is_delete = true;
    await result.save();
    return result;
  }
}

export default SubscribersRepository;
