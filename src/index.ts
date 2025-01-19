import app from "./app";
import cluster from "cluster";
import os from "os";
import dotenv from "dotenv";
import { connectRedis } from "./loaders/redis";

dotenv.config();
const PORT = process.env.PORT || 8000;
const numCPUs = os.cpus().length;

(async () => {
  await connectRedis(); // Ensure Redis is connected before proceeding

  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    // Handle worker exits
    const MAX_RESTARTS = 5;
    let restartCount = 0;
    cluster.on("exit", (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} exited with code ${code} (signal: ${signal})`);
      if (restartCount < MAX_RESTARTS) {
        console.log("Starting a new worker...");
        cluster.fork();
        restartCount++;
      } else {
        console.error("Max worker restart limit reached. No new workers will be spawned.");
      }
    });
  } else {
    // Worker process
    app.listen(PORT, () => {
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
  process.on("SIGINT", async () => {
    console.log("Received SIGINT. Gracefully shutting down...");
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("Received SIGTERM. Gracefully shutting down...");
    process.exit(0);
  });
})();
