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
const app_1 = __importDefault(require("./app"));
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const dotenv_1 = __importDefault(require("dotenv"));
const redis_1 = require("./loaders/redis");
dotenv_1.default.config();
const PORT = process.env.PORT || 8000;
const numCPUs = os_1.default.cpus().length;
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_1.connectRedis)(); // Ensure Redis is connected before proceeding
    if (cluster_1.default.isPrimary) {
        console.log(`Primary ${process.pid} is running`);
        // Fork workers
        for (let i = 0; i < numCPUs; i++) {
            cluster_1.default.fork();
        }
        // Handle worker exits
        const MAX_RESTARTS = 5;
        let restartCount = 0;
        cluster_1.default.on("exit", (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} exited with code ${code} (signal: ${signal})`);
            if (restartCount < MAX_RESTARTS) {
                console.log("Starting a new worker...");
                cluster_1.default.fork();
                restartCount++;
            }
            else {
                console.error("Max worker restart limit reached. No new workers will be spawned.");
            }
        });
    }
    else {
        // Worker process
        app_1.default.listen(PORT, () => {
            console.log(`Worker ${process.pid} is listening on port ${PORT}`);
        });
    }
    // Error handling for the primary process
    process.on("uncaughtException", (error) => {
        console.error("Uncaught Exception:", error);
        process.exit(1); // Exit the process
    });
    process.on("unhandledRejection", (reason, promise) => {
        console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });
    // Graceful shutdown
    process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Received SIGINT. Gracefully shutting down...");
        process.exit(0);
    }));
    process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Received SIGTERM. Gracefully shutting down...");
        process.exit(0);
    }));
}))();
