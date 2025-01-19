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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheManager = void 0;
class CacheManager {
    constructor() {
        this.redisClients = {};
    }
    // Add a Redis client with a unique key
    addRedisClient(key, client) {
        this.redisClients[key] = client;
    }
    // Get a Redis client by key
    getRedisClient(key) {
        return this.redisClients[key] || null;
    }
    // Delete a cache from a specific Redis client
    deleteCache(key, redisClientKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisClient = this.getRedisClient(redisClientKey);
            if (!redisClient) {
                throw new Error("Redis client not found");
            }
            yield redisClient.del(key); // Delete the cache key
        });
    }
}
exports.cacheManager = new CacheManager();
