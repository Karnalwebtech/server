"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const dotenv_1 = __importDefault(require("dotenv"));
const redis_1 = require("./loaders/redis");
const test_1 = require("./test");
dotenv_1.default.config();
(0, redis_1.connectRedis)();
(0, test_1.test)();
const PORT = process.env.PORT || 8000;
const numCPUs = os_1.default.cpus().length;
if (cluster_1.default.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster_1.default.fork(); // Replace the dead worker
    });
}
else {
    // Workers can share any TCP connection
    // In this case, it is an HTTP server
    app_1.default.listen(PORT, () => {
        console.log(`Worker ${process.pid} is listening on port ${PORT}`);
    });
}
// Error handling for the primary process
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    // Perform any cleanup operations here
    process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    // Perform any cleanup operations here
});
