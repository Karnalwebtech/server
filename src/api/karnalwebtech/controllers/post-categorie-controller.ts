import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../middlewares/AsyncHandler";
import CategorieService from "../../../services/karnalwebtech/post-caregorie-service";
import ErrorHandler from "../../../utils/ErrorHandler";
import { redisClient2 } from "../../../loaders/redis";

class CategorieController {
  constructor(private categorieService: CategorieService) {}

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

  // Create category with error handling and cleaner response
  create = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?._id; // Use the correct type for the request user
      const files = req.files;
      // Check if URL already exists
      const isExistingUrl = await this.categorieService.findByExistUrl(
        req.body.metaCanonicalUrl,
        next
      );
      if (isExistingUrl) {
        return next(
          new ErrorHandler("Url already exists, try another one", 400)
        ); // Changed to 400
      }

      // Validate user authentication
      if (!userId) {
        return next(new ErrorHandler("User is not authenticated", 401)); // Changed to 401
      }

      // Create category
      const result = await this.categorieService.create(
        req.body,
        files,
        userId,
        next
      );
      if (result) {
        return this.sendResponse(res, "Category created successfully", 201);
      }

      return next(new ErrorHandler("Failed to create category", 500));
    }
  );

  // Get all categories with pagination
  all = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const query = req.query;
      const resultPerPage = Number(query.rowsPerPage);
      const cacheKey = `categorie_${new URLSearchParams(
        query as any
      ).toString()}`;
      const catCashe = await redisClient2.get(cacheKey);
      if (catCashe) {
        console.log("cashe his");
        return res.json(JSON.parse(catCashe)); // Return cached posts
      }
      console.log("cashe miss");
      // Fetch categories and data counter
      const [result, dataCounter] = await Promise.all([
        this.categorieService.all(query),
        this.categorieService.data_counter(query),
      ]);

      const cacheData = {
        success: true,
        message: "Categorie cache fetched successfully",
        data: {
          result: result, // Assuming result is plain data
          rowsPerPage: resultPerPage,
          dataCounter: dataCounter,
        },
      };
      await redisClient2.set(cacheKey, JSON.stringify(cacheData));

      return this.sendResponse(res, "Categories fetched successfully", 200, {
        result,
        resultPerPage,
        dataCounter,
      });
    }
  );

  // Get single category by ID
  get_single_data = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id, slug } = req.params;
      if (!id && !slug) {
        return next(
          new ErrorHandler("Either ID or slug parameter is required.", 400)
        );
      }
      const cacheKey = id ? `${id}` : `cate_${slug}`;
      console.log(`Checking cache for key: ${cacheKey}`);

      const cachedPosts = await redisClient2.get(cacheKey);
      if (cachedPosts) {
        console.log("Cache hit");
        return res.json(JSON.parse(cachedPosts)); // Return cached posts
      }
      console.log("Cache miss");
      // Fetch category by ID
      const result = id
        ? await this.categorieService.findBYpageid(id, next)
        : await this.categorieService.findBySlug(slug, next);
      if (result) {
        const cacheData = {
          success: true,
          message: "Categorie cache fetched successfully",
          data:result,
        };
        await redisClient2.set(cacheKey, JSON.stringify(cacheData)); // Cache for 1 hour

        return this.sendResponse(
          res,
          "Category fetched successfully",
          200,
          result
        );
      }

      return next(new ErrorHandler("Category not found", 404));
    }
  );

  // Update category
  update = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: string = (req as any).user._id;
      const files = req.files;

      if (!user) {
        return next(new ErrorHandler("User not authenticated", 401)); // Changed to 401
      }

      // Update category
      const result = await this.categorieService.update(
        req.body,
        files,
        user,
        next
      );
      if (result) {
        return this.sendResponse(res, "Category updated successfully", 200);
      }

      return next(new ErrorHandler("Failed to update category", 500));
    }
  );
  removeItem = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const id: string = req.params.id;
      const categorie = await this.categorieService.removeItem(id, next);
      if (categorie) {
        return res.status(200).json({
          succes: true,
        });
      }
    }
  );
}

export default CategorieController;
