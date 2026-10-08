import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { ERROR_CODES } from "./constants/errorCodes.js";
import authRoutes from "./routes/authRoutes.js";
import hotelsRoutes from "./routes/hotelsRoutes.js";
import reservationsRoutes from "./routes/reservationsRoutes.js";
import { ApiError } from "./middleware/ApiError.js";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const GLOBAL_REQUEST_LIMIT = 200;
const AUTH_REQUEST_LIMIT = 10;

export const createApp = ({ enableRateLimit = true } = {}) => {
  const app = express();
  const isDevelopment = process.env.NODE_ENV === "development";

  app.use(cors(createCorsOptions(isDevelopment)));
  app.use(helmet());
  app.use(express.json());

  if (enableRateLimit) {
    app.use(createGlobalLimiter());
  }

  mountApiRoutes(app, enableRateLimit);

  app.use(respondEndpointNotFound);
  app.use(createErrorHandler(isDevelopment));

  return app;
};

const createCorsOptions = (isDevelopment) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL
  ];

  return {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (isDevelopment && origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    }
  };
};

const createRateLimiter = (limit, errorCode, message) =>
  rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    limit,
    standardHeaders: "draft-6",
    legacyHeaders: false,
    handler: (req, res, next) => {
      next(new ApiError(429, errorCode, message));
    }
  });

const createGlobalLimiter = () =>
  createRateLimiter(
    GLOBAL_REQUEST_LIMIT,
    ERROR_CODES.TOO_MANY_REQUESTS,
    "Too many requests from this IP, please try again later."
  );

const createAuthLimiter = () =>
  createRateLimiter(
    AUTH_REQUEST_LIMIT,
    ERROR_CODES.TOO_MANY_AUTH_ATTEMPTS,
    "Too many auth attempts. Brute force protection activated."
  );

const mountApiRoutes = (app, enableRateLimit) => {
  const authGuards = enableRateLimit ? [createAuthLimiter()] : [];

  app.use("/api/auth", ...authGuards, authRoutes);
  app.use("/api/hotels", hotelsRoutes);
  app.use("/api/reservations", reservationsRoutes);
};

const respondEndpointNotFound = (req, res, next) => {
  next(new ApiError(
    404,
    ERROR_CODES.ENDPOINT_NOT_FOUND,
    `Path ${req.url} not found.`
  ));
};

const createErrorHandler = (isDevelopment) => (err, req, res, next) => {
  console.error("[Server Error]:", err.message || err);

  let statusCode = 500;
  let response = {
    error: ERROR_CODES.INTERNAL_SERVER_ERROR
  };

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    response.error = err.errorCode;

    if (isDevelopment) {
      response.devMessage = err.devMessage;
    }
  } else if (isDevelopment) {
    response.devMessage = err.message || "An unexpected server error occurred.";
  }

  res.status(statusCode).json(response);
};
