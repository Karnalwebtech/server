import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../middlewares/AsyncHandler";
import ErrorHandler from "../../../utils/ErrorHandler";
import SubscribersService from "../../../services/karnalwebtech/subscribers-service";

class SubscribersController {
  constructor(private subscribersService: SubscribersService) {}
  // Helper function to send a consistent response
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

  // Create post with error handling and cleaner response
  create = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await this.subscribersService.create(req.body, next);
      if (result) {
        return this.sendResponse(res, "Data created successfully", 201);
      }
      return next(new ErrorHandler("Failed to create image", 500));
    }
  );

  // Get all post with pagination
  all = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const query = req.query;
      const resultPerPage = Number(query.rowsPerPage);
      const [result, dataCounter] = await Promise.all([
        this.subscribersService.all(query),
        this.subscribersService.data_counter(query),
      ]);

      return this.sendResponse(res, "Subscribers fetched successfully", 200, {
        result,
        resultPerPage,
        dataCounter,
      });
    }
  );

  // Get single post by ID
  get_single_data = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      if (!id) {
        return next(new ErrorHandler("ID parameter is required.", 400));
      }
      const result = await this.subscribersService.findBYpageid(id, next);
      if (result) {
        return this.sendResponse(
          res,
          "Subscribers fetched successfully",
          200,
          result
        );
      }

      return next(new ErrorHandler("Contact not found", 404));
    }
  );

  removeItem = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const id: string = req.params.id;
      const result = await this.subscribersService.removeItem(id, next);
      if (result) {
        return res.status(200).json({
          succes: true,
        });
      }
    }
  );
}

export default SubscribersController;
