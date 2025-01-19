import { Request, Response, NextFunction } from "express";
import Redis from "redis"; // Ensure you have installed ioredis
import { redisClient1, redisClient2 } from "../../loaders/redis";
import ErrorHandler from "../ErrorHandler";

class CacheManager {
  //   private redis: Redis;

  constructor() {
    // Initialize the Redis client
    // this.redis = new Redis();
  }

  /**
   * Removes specific cache or clears the entire database based on the request.
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  private async scanAndDelete(
    cursor: number = 0,
    pattern: string
  ): Promise<any> {
    console.log("Starting scan with cursor:", cursor);
    let keysDeleted = false;
    const clients = [redisClient1, redisClient2]; // Array of Redis clients
  
    try {
      for (const client of clients) {
        let currentCursor = cursor;
        do {
          const reply = await client.scan(currentCursor, {
            MATCH: `${pattern}*`,
            COUNT: 100,
          });
  
          console.log("Scan result:", reply);
          console.log("Next cursor:", reply.cursor);
          console.log("Keys returned:", reply.keys);
  
          // Process the keys
          for (const key of reply.keys) {
            console.log(`Deleting key from client: ${key}`);
            await client.del(key);
            keysDeleted = true;
          }
  
          // Update cursor for the current client
          currentCursor = reply.cursor;
        } while (currentCursor !== 0);
      }
  
      console.log("Scan complete across all clients");
      return keysDeleted;
    } catch (err) {
      console.error("Error clearing keys:", err);
      throw err;
    }
  }
  
  async removeCache(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);
      const { key } = req.body;
      if (!key) {
        return next(new ErrorHandler("Key is required.", 400));
      }
      const success = await this.scanAndDelete(0, key);
      if (success) {
        return res
          .status(200)
          .json({ success: true, message: "All cache cleared." });
      }
      res
        .status(200)
        .json({ success: true, message: "Cache matching keys found." });
    } catch (error) {
      console.error("Error removing cache:", error);

      res
        .status(500)
        .json({ success: false, message: "Failed to remove cache." });
    }
  }

  //   /**
  //    * Adds a cache entry with optional expiration.
  //    * @param key - Cache key
  //    * @param value - Cache value
  //    * @param ttl - Time-to-live in seconds (optional)
  //    */
  //   async addCache(key: string, value: string, ttl?: number): Promise<void> {
  //     try {
  //       if (ttl) {
  //         await this.redis.set(key, value, "EX", ttl);
  //       } else {
  //         await this.redis.set(key, value);
  //       }
  //       console.log(`Cache set for key: ${key}`);
  //     } catch (error) {
  //       console.error("Error adding cache:", error);
  //     }
  //   }

  //   /**
  //    * Fetches a cache entry by key.
  //    * @param key - Cache key
  //    * @returns - Cache value or null if not found
  //    */
  //   async getCache(key: string): Promise<string | null> {
  //     try {
  //       return await this.redis.get(key);
  //     } catch (error) {
  //       console.error("Error fetching cache:", error);
  //       return null;
  //     }
  //   }
}

export default CacheManager;

// async function scan(cursor: number = 0, pattern: string): Promise<any> {
//   console.log("Starting scan with cursor:", cursor);
//   let keysDeleted = false;
//   try {
//     const reply = await redisClient1.scan(cursor, {
//       MATCH: `${pattern}*`,
//       COUNT: 100,
//     });

//     console.log("Scan result:", reply);
//     console.log("Next cursor:", reply.cursor);
//     console.log("Keys returned:", reply.keys);
//     // Update cursor for next scan
//     cursor = reply.cursor;
//     // Check if there were no keys found or if cursor didn't progress
//     if (reply.keys.length === 0) {
//       console.log("No keys found for the pattern 'posts_*'.");
//     }

//     // Process the keys
//     for (const key of reply.keys) {
//       console.log(`Deleting key: ${key}`);
//       await redisClient1.del(key);
//       keysDeleted = true;
//     }

//     // If there are more keys to fetch, recursively call scan with the updated cursor
//     if (cursor !== 0) {
//       await scan(cursor, pattern);
//     } else {
//       console.log("Scan complete");
//       return keysDeleted;
//     }
//   } catch (err) {
//     console.error("Error clearing keys:", err);
//     throw err;
//   }
// }
