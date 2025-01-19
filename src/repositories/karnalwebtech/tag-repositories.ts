import { NextFunction } from "express";
import User from "../../models/primary/userModel";
import ApiFeatures from "../../utils/apiFeatuers";
import ErrorHandler from "../../utils/ErrorHandler";
import { generateRandomId } from "../../utils/generateRandomId";
import TagModel from "../../models/karnalwebtech/tag";
import ImageRepository from "../../utils/comman-repositories/imageRepository";
const imageRepository = new ImageRepository();
class TagRepository {
  // Reusable function to generate unique category ID
  private generateId(uuid: string, randomId: string, number: number): string {
    return `tag_${randomId.toLowerCase()}_${uuid}${number}`;
  }

  // Reusable function to get the next category number
  private async getNextTagNumber(): Promise<number> {
    const count = await TagModel.countDocuments();
    return count + 1;
  }

  // Helper function for populating category data
  private async populateTagData(query: any) {
    return query.populate([
      { path: "audit_log", model: User },
      { path: "feature_image", model: "Karnal_Images" },
      { path: "seo", model: "Karnal_web_seo" },
    ]);
  }

  // Create a new category
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
        description,
        content,
        uuid,
        type,
        status,
        metaCanonicalUrl,
      } = data;
      const imageIds = image_data.map((item: any) => item._id);

      // Get next category number
      const counter = await this.getNextTagNumber();

      // Generate category ID
      const tag_id = this.generateId(uuid, randomId, counter);

      // Prepare data to be saved
      const newData = {
        _no: counter,
        title,
        description,
        content,
        status,
        type: type,
        slug: metaCanonicalUrl.toLowerCase(),
        feature_image: imageIds[0],
        seo: seo?._id,
        tag_id: tag_id,
        audit_log: user_id,
      };
      if (imageIds) {
        const updateData = {
          displayedpath: newData.slug.toLowerCase(), // Set the displayed path to the category slug
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
      // Create and save the new tag
      const new_data = new TagModel(newData);
      return await new_data.save();
    } catch (error: any) {
      throw new Error(`Error creating tag: ${error.message}`);
    }
  }

  // Find tag by URL
  async findByUrl(url: string) {
    return await TagModel.findOne({ slug: url });
  }

  // Retrieve all tag with filters and pagination
  async all(query: any) {
    const resultPerPage = Number(query.rowsPerPage);
    const apiFeatures = new ApiFeatures(
      TagModel.find({ is_delete: { $ne: true } }),
      query
    );
    apiFeatures.search().filter().sort().pagination(resultPerPage);

    // Apply population and execute query
    const result = await apiFeatures
      .getQuery()
      .populate([
        { path: "audit_log", model: User },
        { path: "feature_image", model: "Karnal_Images" },
        { path: "seo", model: "Karnal_web_seo" },
      ])
      .sort({ updated_at: -1 })
      .exec();

    return result;
  }

  // Get the total count of categories based on filters
  async data_counter(query: any) {
    const apiFeatures = new ApiFeatures(
      TagModel.find({ is_delete: { $ne: true } }),
      query
    );
    apiFeatures.search().filter();
    const result = await apiFeatures.exec();
    return result.length;
  }

  // Find tag by ID
  async find_by_id(id: string, next: NextFunction) {
    const tag = await this.populateTagData(TagModel.findById(id));

    if (!tag) {
      return next(new ErrorHandler(`tag with ID ${id} not found`, 404));
    }

    return tag;
  }

  // Update a tag
  async update(data: any, image_data: any, user_id: string,next:NextFunction) {
    const { title, description, content, status, metaCanonicalUrl } = data;
    const image_ids = image_data?.length
      ? image_data.map((item: any) => item._id)
      : data?.images;

    const updated_data = {
      title,
      content,
      description,
      status: status === "" ? "published" : status,
      slug: metaCanonicalUrl.toLowerCase(),
      feature_image: image_ids?.length ? image_ids : undefined,
      audit_log: user_id,
    };

    const post_prev_data: any = await TagModel.findOne({
      tag_id: data.id,
    });

    const result = await TagModel.findOneAndUpdate(
      { tag_id: data.id },
      updated_data,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    if (!result) {
      throw new Error("Tag not found");
    }

    if (image_ids) {
      const updateData = {
        displayedpath: result.slug.toLowerCase() , // Set the displayed path to the category slug
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
    return result;
  }

  // Find tag by URL and exclude certain ID
  async findBYUrl(url: string, excludeId: string) {
    const query: any = { slug: url };
    if (excludeId) query._id = { $ne: excludeId }; // Exclude specified ID
    return await TagModel.findOne(query);
  }

  // Find category by page ID
  async findBYpageid(id: string, next: NextFunction) {
    const tag = await this.populateTagData(TagModel.findOne({ tag_id: id }));

    if (!tag) {
      return next(new ErrorHandler(`tag with ID ${id} not found`, 404));
    }

    return tag;
  }
  async removeItem(id: string, next: NextFunction) {
    const tag = await this.populateTagData(TagModel.findOne({ tag_id: id }));

    if (!tag) {
      return next(new ErrorHandler(`tag with ID ${id} not found`, 404));
    }
    tag.is_delete = true;
    await tag.save();
    return tag;
  }
}

export default TagRepository;
