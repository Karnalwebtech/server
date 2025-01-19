import { NextFunction } from "express";
import User from "../../models/primary/userModel";
import ApiFeatures from "../../utils/apiFeatuers";
import ErrorHandler from "../../utils/ErrorHandler";
import { generateRandomId } from "../../utils/generateRandomId";
import PortfolioModel from "../../models/karnalwebtech/portfolio-model";
import ImageRepository from "../../utils/comman-repositories/imageRepository";
const imageRepository = new ImageRepository();
class PortfoliotRepository {
  // Reusable function to generate unique post ID
  private generatePostId(
    uuid: string,
    randomId: string,
    number: number
  ): string {
    return `ptfo_${randomId.toLowerCase()}_${uuid}${number}`;
  }

  // Reusable function to get the next post number
  private async getNextPostNumber(): Promise<number> {
    const count = await PortfolioModel.countDocuments();
    return count + 1;
  }

  // Helper function for populating category data
  private async populatePostData(query: any) {
    return query.populate([
      { path: "audit_log", model: User },
      { path: "feature_image", model: "Karnal_Images" },
      { path: "categorie", model: "Karnal_categorie" },
      { path: "tag", model: "Karnal_tag" },
      { path: "seo", model: "Karnal_web_seo" },
    ]);
  }

  // Create a new post
  async create(
    data: any,
    image_data: any,
    seo: any,
    user_id: string,
    next: NextFunction
  ) {
    try {
      const randomId = generateRandomId();
      const {
        title,
        content,
        uuid,
        categorie,
        tags,
        description,
        status,
        metaCanonicalUrl,
      } = data;
      const imageIds = image_data.map((item: any) => item._id);

      // Get next post number
      const postNumber = await this.getNextPostNumber();

      // Generate post ID
      const catId = this.generatePostId(uuid, randomId, postNumber);

      // Prepare data to be saved
      const newPostData = {
        _no: postNumber,
        title,
        content,
        status,
        description,
        categorie: categorie
          ? categorie.split(",")
          : ["6741bd2663fa4c1a8dd7548b"], // Default categorie ID
        tag: tags ? tags.split(",") : ["6741bd9d63fa4c1a8dd7549f"], // Default tag ID
        slug: metaCanonicalUrl.toLowerCase(),
        feature_image: imageIds[0],
        seo: seo?._id,
        ptfo_id: catId,
        audit_log: user_id,
      };
      // Prepare image update promises for updating the displayed path and activating the image
      if (imageIds) {
        const updateData = {
          displayedpath: newPostData.slug.toLowerCase(), // Set the displayed path to the category slug
          is_active: true, // Mark the image as active
        };
        const oldImageId = "";
        await imageRepository.updateImage(
          imageIds,
          "karnalwebtech",
          oldImageId,
          updateData,
          next
        );
      }
      // Create and save the new post
      const post = new PortfolioModel(newPostData);
      return await post.save();
    } catch (error: any) {
      throw new Error(`Error creating portfolio: ${error.message}`);
    }
  }

  // Find post by URL
  async findByUrl(url: string) {
    return await PortfolioModel.findOne({ slug: url });
  }

  // Retrieve all post with filters and pagination
  async all(query: any) {
    const resultPerPage = Number(query.rowsPerPage);
    const apiFeatures = new ApiFeatures(
      PortfolioModel.find({ is_delete: { $ne: true } }),
      query
    );
    apiFeatures.search().filter().sort().pagination(resultPerPage);

    // Apply population and execute query
    const result = await apiFeatures
      .getQuery()
      .populate([
        { path: "audit_log", model: User },
        { path: "feature_image", model: "Karnal_Images" },
        { path: "categorie", model: "Karnal_categorie" },
        { path: "tag", model: "Karnal_tag" },
        { path: "seo", model: "Karnal_web_seo" },
      ])
      .sort({ updated_at: -1 })
      .exec();

    return result;
  }

  // Get the total count of [pst] based on filters
  async data_counter(query: any) {
    const apiFeatures = new ApiFeatures(
      PortfolioModel.find({ is_delete: { $ne: true } }),
      query
    );
    apiFeatures.search().filter();
    const result = await apiFeatures.exec();
    return result.length;
  }

  // Find portfolio by ID
  async find_by_id(id: string, next: NextFunction) {
    const result = await this.populatePostData(PortfolioModel.findById(id));
    if (!result) {
      return next(new ErrorHandler(`portfolio with ID ${id} not found`, 404));
    }
    return result;
  }

  // Update a portfolio
  async update(
    data: any,
    image_data: any,
    user_id: string,
    next: NextFunction
  ) {
    const {
      title,
      content,
      categorie,
      description,
      tags,
      status,
      metaCanonicalUrl,
    } = data;
    const image_ids = image_data?.length
      ? image_data.map((item: any) => item._id)
      : data?.images;

    const updated_data: any = {
      title,
      content,
      description,
      categorie: categorie
        ? categorie.split(",")
        : ["6741bd2663fa4c1a8dd7548b"], // Default categorie ID
      tag: tags ? tags.split(",") : ["6741bd9d63fa4c1a8dd7549f"], // Default tag ID
      status: status === "" ? "published" : status,
      slug: metaCanonicalUrl.toLowerCase(),
      feature_image: image_ids?.length ? image_ids : undefined,
      audit_log: user_id,
    };
    const post_prev_data: any = await PortfolioModel.findOne({
      ptfo_id: data.id,
    });
    const updated_post = await PortfolioModel.findOneAndUpdate(
      { ptfo_id: data.id },
      updated_data,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    if (!updated_post) {
      throw new Error("Post not found");
    }

    if (image_ids) {
      const updateData = {
        displayedpath: updated_post.slug.toLowerCase(), // Set the displayed path to the category slug
        is_active: true, // Mark the image as active
      };
      const oldImageId = post_prev_data.feature_image._id;
      await imageRepository.updateImage(
        image_ids,
        "karnalwebtech",
        oldImageId,
        updateData,
        next
      );
    }
    return updated_post;
  }

  // Find post by URL and exclude certain ID
  async findBYUrl(url: string, excludeId: string) {
    const query: any = { slug: url };
    if (excludeId) query._id = { $ne: excludeId }; // Exclude specified ID
    return await PortfolioModel.findOne(query);
  }

  // Find post by page ID
  async findBYpageid(id: string, next: NextFunction) {
    const result = await this.populatePostData(
      PortfolioModel.findOne({ ptfo_id: id })
    );

    if (!result) {
      return next(new ErrorHandler(`Post with ID ${id} not found`, 404));
    }

    return result;
  }
  async removeItem(id: string, next: NextFunction) {
    const result = await this.populatePostData(
      PortfolioModel.findOne({ ptfo_id: id })
    );

    if (!result) {
      return next(new ErrorHandler(`portfolio with ID ${id} not found`, 404));
    }
    result.is_delete = true;
    await result.save();
    return result;
  }
}

export default PortfoliotRepository;
