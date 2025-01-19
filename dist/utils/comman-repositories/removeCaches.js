"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("../../loaders/redis");
const ErrorHandler_1 = __importDefault(require("../ErrorHandler"));
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
    scanAndDelete() {
        return __awaiter(this, arguments, void 0, function* (cursor = 0, pattern) {
            console.log("Starting scan with cursor:", cursor);
            let keysDeleted = false;
            const clients = [redis_1.redisClient1, redis_1.redisClient2]; // Array of Redis clients
            try {
                for (const client of clients) {
                    let currentCursor = cursor;
                    do {
                        const reply = yield client.scan(currentCursor, {
                            MATCH: `${pattern}*`,
                            COUNT: 100,
                        });
                        console.log("Scan result:", reply);
                        console.log("Next cursor:", reply.cursor);
                        console.log("Keys returned:", reply.keys);
                        // Process the keys
                        for (const key of reply.keys) {
                            console.log(`Deleting key from client: ${key}`);
                            yield client.del(key);
                            keysDeleted = true;
                        }
                        // Update cursor for the current client
                        currentCursor = reply.cursor;
                    } while (currentCursor !== 0);
                }
                console.log("Scan complete across all clients");
                return keysDeleted;
            }
            catch (err) {
                console.error("Error clearing keys:", err);
                throw err;
            }
        });
    }
    removeCache(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const { key } = req.body;
                if (!key) {
                    return next(new ErrorHandler_1.default("Key is required.", 400));
                }
                const success = yield this.scanAndDelete(0, key);
                if (success) {
                    return res
                        .status(200)
                        .json({ success: true, message: "All cache cleared." });
                }
                res
                    .status(200)
                    .json({ success: true, message: "Cache matching keys found." });
            }
            catch (error) {
                console.error("Error removing cache:", error);
                res
                    .status(500)
                    .json({ success: false, message: "Failed to remove cache." });
            }
        });
    }
}
exports.default = CacheManager;
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
