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
exports.connectRedis = exports.redisClient2 = exports.redisClient1 = void 0;
// lib/redis.ts
const redis_1 = require("redis");
// Redis Client 1 (for example, for the main application database)
const redisClient1 = (0, redis_1.createClient)({
    password: process.env.REDIS_PASSWORD_1, // Store your password in environment variables for security
    socket: {
        host: "redis-14075.c212.ap-south-1-1.ec2.redns.redis-cloud.com", // Your Redis Cloud host
        port: 14075, // Your Redis Cloud port
    },
});
exports.redisClient1 = redisClient1;
// Redis Client 2 (for another database or service)
const redisClient2 = (0, redis_1.createClient)({
    password: process.env.REDIS_PASSWORD_2, // Another password for the second Redis instance
    socket: {
        host: "redis-14656.c212.ap-south-1-1.ec2.redns.redis-cloud.com", // Your Redis Cloud host
        port: 14656, // Your Redis Cloud port
    },
});
exports.redisClient2 = redisClient2;
// Event listeners
redisClient1.on("error", (err) => {
    console.error("Redis Client 1 Error:", err);
});
redisClient2.on("error", (err) => {
    console.error("Redis Client 2 Error:", err);
});
// Connect both clients
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redisClient1.connect();
        yield redisClient2.connect();
        console.log("Connected to both Redis servers");
    }
    catch (error) {
        console.error("Error connecting to Redis servers:", error);
    }
});
exports.connectRedis = connectRedis;
