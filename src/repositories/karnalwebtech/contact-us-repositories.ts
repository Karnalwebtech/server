import { NextFunction } from "express";
import User from "../../models/primary/userModel";
import ApiFeatures from "../../utils/apiFeatuers";
import ErrorHandler from "../../utils/ErrorHandler";
import { generateRandomId } from "../../utils/generateRandomId";
import contactUsModel from "../../models/karnalwebtech/contact-us-model";

class ContactUsRepository {
  // Reusable function to generate unique post ID
  private generatePostId(
    uuid: string,
    randomId: string,
    number: number
  ): string {
    return `cont_${randomId.toLowerCase()}_${uuid}${number}`;
  }

  // Reusable function to get the next post number
  private async getNextNumber(): Promise<number> {
    const count = await contactUsModel.countDocuments();
    return count + 1;
  }

  // Helper function for populating category data
  private async populateContactData(query: any) {
    return query.populate([{ path: "audit_log", model: User }]);
  }

  // Create a new post
  async create(data: any, next: NextFunction) {
    try {
      const randomId = generateRandomId();
      console.log(data)
      const { name, uuid, email, mobile, message } = data;

      // Get next post number
      const contactNumber = await this.getNextNumber();

      // Generate post ID
      const catId = this.generatePostId(uuid, randomId, contactNumber);

      // Prepare data to be saved
      const newPostData = {
        _no: contactNumber,
        name,
        email,
        mobile,
        description: message,
        cont_id: catId,
      };
      const post = new contactUsModel(newPostData);
      return await post.save();
    } catch (error: any) {
      throw new Error(`Error creating Contact us: ${error.message}`);
    }
  }

  // Retrieve all post with filters and pagination
  async all(query: any) {
    const resultPerPage = Number(query.rowsPerPage);
    const apiFeatures = new ApiFeatures(
      contactUsModel.find({ is_delete: { $ne: true } }),
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
      contactUsModel.find({ is_delete: { $ne: true } }),
      query
    );
    apiFeatures.search().filter();
    const result = await apiFeatures.exec();
    return result.length;
  }

  // Find portfolio by ID
  async find_by_id(id: string, next: NextFunction) {
    const result = await this.populateContactData(contactUsModel.findById(id));
    if (!result) {
      return next(new ErrorHandler(`portfolio with ID ${id} not found`, 404));
    }
    return result;
  }

  // Update a portfolio
  async update(data: any, user_id: string, next: NextFunction) {
    const { name, mobile, message, email } = data;

    const updated_data: any = {
      name,
      email,
      mobile,
      description: message,
      audit_log: user_id,
    };
    const updated_post = await contactUsModel.findOneAndUpdate(
      { cont_id: data.id },
      updated_data,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    if (!updated_post) {
      throw new Error("Contact not found");
    }

    return updated_post;
  }

  // Find post by URL and exclude certain ID
  async findBYUrl(url: string, excludeId: string) {
    const query: any = { slug: url };
    if (excludeId) query._id = { $ne: excludeId }; // Exclude specified ID
    return await contactUsModel.findOne(query);
  }

  // Find post by page ID
  async findBYpageid(id: string, next: NextFunction) {
    const result = await this.populateContactData(
      contactUsModel.findOne({ cont_id: id })
    );

    if (!result) {
      return next(new ErrorHandler(`Contact with ID ${id} not found`, 404));
    }
    return result;
  }
  async removeItem(id: string, next: NextFunction) {
    const result = await this.populateContactData(
      contactUsModel.findOne({ cont_id: id })
    );

    if (!result) {
      return next(new ErrorHandler(`Contact with ID ${id} not found`, 404));
    }
    result.is_delete = true;
    await result.save();
    return result;
  }
}

export default ContactUsRepository;
