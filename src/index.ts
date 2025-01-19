import app from "./app";
import cluster from "cluster";
import os from "os";
import dotenv from "dotenv";
import { connectRedis } from "./loaders/redis";
import { test } from "./test";

dotenv.config();
connectRedis();
test()
const PORT = process.env.PORT || 8000;
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Replace the dead worker
  });
} else {
  // Workers can share any TCP connection
  // In this case, it is an HTTP server
  app.listen(PORT, () => {
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