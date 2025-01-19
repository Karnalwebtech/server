import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import dotenv from "dotenv";
import errorMiddleware from "./middlewares/error";

// Load environment variables
dotenv.config();

const app = express();
app.use(compression());
app.set("trust proxy", 1); // Enable proxy trust for rate limiting

// Security and performance middleware
app.disable("x-powered-by");
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Helmet configuration for enhanced security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },
  })
);

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://karnalwebtech.vercel.app",
  "https://inventory-7773.vercel.app",
  "https://karnalwebtech-two.vercel.app",
  "https://www.thesalesmens.com",
  "https://thesalesmens.com",
];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Fallback for unhandled preflight requests
app.options("*", cors());

// Loaders for modular architecture
import crm_repositoriesLoader from "./loaders/crm/repositoriesLoader";
import crm_servicesLoader from "./loaders/crm/servicesLoader";
import crm_controllersLoader from "./loaders/crm/controllersLoader";
import crm_routesLoader from "./app-routes/crm-Loader";

import karnal_repositoriesLoader from "./loaders/karnalwebtech/repositoriesLoader";
import karnal_servicesLoader from "./loaders/karnalwebtech/servicesLoader";
import karnal_controllersLoader from "./loaders/karnalwebtech/controllersLoader";
import karnal_routesLoader from "./app-routes/karnal-web-tech-loader";

import ImageRepository from "./utils/comman-repositories/imageRepository";
import ImageController from "./api/karnalwebtech/controllers/image-controller";
import cacheRouter from "./api/karnalwebtech/routes/cache-route";
import imageRoutes from "./api/karnalwebtech/routes/image-route";

// CRM Routes Initialization
const crm_repositories = crm_repositoriesLoader();
const crm_services = crm_servicesLoader(crm_repositories);
const crm_controllers = crm_controllersLoader(crm_services);
crm_routesLoader(app, crm_controllers);

// Karnal Web Tech Routes Initialization
const karnal_repositories = karnal_repositoriesLoader();
const karnal_services = karnal_servicesLoader(karnal_repositories);
const karnal_controllers = karnal_controllersLoader(karnal_services);
karnal_routesLoader(app, karnal_controllers);

// Shared routes for image handling
const imageRepository = new ImageRepository();
const imageController = new ImageController(imageRepository);
app.use("/api/v2/image", imageRoutes(imageController));
app.use("/api/v2/", cacheRouter);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error middleware
app.use(errorMiddleware);

export default app;
