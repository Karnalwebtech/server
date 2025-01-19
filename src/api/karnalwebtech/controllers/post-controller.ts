import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../middlewares/AsyncHandler";
import ErrorHandler from "../../../utils/ErrorHandler";
import PostService from "../../../services/karnalwebtech/post-service";
import { redisClient1 } from "../../../loaders/redis";
import generateSitemap from "../../../utils/sitemapUtils";

class PostController {
  constructor(private postService: PostService) {}

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
      const userId = (req as any).user?._id; // Use the correct type for the request user
      const files = req.files;

      // Check if URL already exists
      const isExistingUrl = await this.postService.findByUrl(
        req.body.metaCanonicalUrl
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

      // Create post
      const result = await this.postService.create(
        req.body,
        files,
        userId,
        next
      );
      if (result) {
        return this.sendResponse(res, "Post created successfully", 201);
      }

      return next(new ErrorHandler("Failed to create post", 500));
    }
  );

  // Get all post with pagination
  all = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const query = req.query;
      const resultPerPage = Number(query.rowsPerPage);
      const cacheKey = `posts_${new URLSearchParams(query as any).toString()}`;
      // // Check if data is in Redis cache
      const cachedPosts = await redisClient1.get(cacheKey);
      if (cachedPosts) {
        console.log("cashe hit");
        return res.json(JSON.parse(cachedPosts)); // Return cached posts
      }
      const [result, dataCounter] = await Promise.all([
        this.postService.all(query),
        this.postService.data_counter(query),
      ]);
      const cacheData = {
        success: true,
        message: "Post cache fetched successfully",
        data: {
          result: result, // Assuming result is plain data
          rowsPerPage: resultPerPage,
          dataCounter: dataCounter,
        },
      };
      console.log("cache miss");
      // // Store the result data in Redis cache (cache for 1 hour)
      await redisClient1.set(cacheKey, JSON.stringify(cacheData));

      return this.sendResponse(res, "Post fetched successfully", 200, {
        result,
        resultPerPage,
        dataCounter,
      });
    }
  );

  get_single_data = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id, slug } = req.params;
      if (!id && !slug) {
        return next(
          new ErrorHandler("Either ID or slug parameter is required.", 400)
        );
      }

      // Generate cache key based on the id or slug
      const cacheKey = id ? `${id}` : `post_${slug}`;
      console.log(`Checking cache for key: ${cacheKey}`);

      try {
        // Check if data is in Redis cache
        const cachedPosts = await redisClient1.get(cacheKey);
        if (cachedPosts) {
          console.log("Cache hit");
          return res.json(JSON.parse(cachedPosts)); // Return cached posts
        }
        console.log("Cache miss");

        // Fetch post data from database
        const result = id
          ? await this.postService.findBYpageid(id, next)
          : await this.postService.findBYSlug(slug, next);

        if (result) {
          // Store the result in Redis cache
          const cacheData = {
            success: true,
            message: "Post cache fetched successfully",
            data:result,
          };
          try {
            await redisClient1.set(cacheKey, JSON.stringify(cacheData)); // Cache for 1 hour
            console.log("Data cached successfully");
          } catch (cacheError) {
            console.log("Cache set failed", cacheError);
          }

          return this.sendResponse(
            res,
            "Post fetched successfully",
            200,
            result
          );
        }

        return next(new ErrorHandler("Post not found", 404));
      } catch (error) {
        console.log("Error in fetching post", error);
        return next(new ErrorHandler("Internal Server Error", 500));
      }
    }
  );

  // Update post
  update = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: string = (req as any).user._id;
      const files = req.files;

      if (!user) {
        return next(new ErrorHandler("User not authenticated", 401)); // Changed to 401
      }

      // Update post
      const result = await this.postService.update(req.body, files, user, next);
      if (result) {
        return this.sendResponse(res, "Post updated successfully", 200);
      }

      return next(new ErrorHandler("Failed to update post", 500));
    }
  );
  removeItem = AsyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const id: string = req.params.id;
      const result = await this.postService.removeItem(id, next);
      if (result) {
        return res.status(200).json({
          succes: true,
        });
      }
    }
  );
}

export default PostController;
