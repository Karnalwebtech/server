import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../middlewares/AsyncHandler";
import ImageRepository from "../../../utils/comman-repositories/imageRepository";
import User from "../../../models/primary/userModel";
import ErrorHandler from "../../../utils/ErrorHandler";

class ImageController {
  constructor(private imageRepository: ImageRepository) {}
  private sendResponse(
    res: Response,
    message: string,
    statusCode: number,
    data: any = null
  ) {
    return res.status(statusCode).json({
      success: statusCode < 400,
      message,
      data,
    });
  }
  // Get all categories with pagination
  all = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const query = req.query;
      const resultPerPage = Number(query.rowsPerPage) || 25;

      // Fetch tag and data counter
      const [result, dataCounter] = await Promise.all([
        this.imageRepository.all(query, "karnalwebtech", User),
        this.imageRepository.data_counter(query, "karnalwebtech"),
      ]);

      return this.sendResponse(res, "image fetched successfully", 200, {
        result,
        resultPerPage,
        dataCounter,
      });
    }
  );
  get_single_data = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      if (!id) {
        return next(new ErrorHandler("ID parameter is required.", 400));
      }
      const result = await this.imageRepository.findById(
        id,
        "karnalwebtech",
        next
      );
      if (result) {
        return res.status(200).json({
          success: true,
          message: "Image fetched successfully",
          data: result,
        });
      }
      return next(new ErrorHandler("Image not found", 404));
    }
  );
  update = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = req.body;
      if (!data.id) {
        return next(new ErrorHandler("ID parameter is required.", 400));
      }
      const result = await this.imageRepository.update(
        data,
        "karnalwebtech",
        next
      );

      if (result) {
        return res.status(200).json({
          success: true,
          message: "Image update successfully",
        });
      }
      return next(new ErrorHandler("Image not found", 404));
    }
  );
}

export default ImageController;
