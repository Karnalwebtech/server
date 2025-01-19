import { createClient, RedisClientType } from "redis";

class CacheManager {
  private redisClients: { [key: string]: RedisClientType };

  constructor() {
    this.redisClients = {};
  }

  // Add a Redis client with a unique key
  addRedisClient(key: string, client: RedisClientType): void {
    this.redisClients[key] = client;
  }

  // Get a Redis client by key
  getRedisClient(key: string): RedisClientType | null {
    return this.redisClients[key] || null;
  }

  // Delete a cache from a specific Redis client
  async deleteCache(key: string, redisClientKey: string): Promise<void> {
    const redisClient = this.getRedisClient(redisClientKey);
    if (!redisClient) {
      throw new Error("Redis client not found");
    }
    await redisClient.del(key); // Delete the cache key
  }
}

export const cacheManager = new CacheManager();
