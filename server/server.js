import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import prisma from "./prismaClient.js";
import { rateLimit } from "express-rate-limit";
import { ERROR_CODES } from "./constants/errorCodes.js";
import authRoutes from "./routes/authRoutes.js";
import hotelsRoutes from "./routes/hotelsRoutes.js";
import { ApiError } from "./middleware/ApiError.js";

dotenv.config();

const app = express();

const isDevelopment = process.env.NODE_ENV === "development";

const allowedOrigins = [
    process.env.FRONTEND_URL // TODO: Add the frontend URL after deploying the client application
];

app.use(cors({
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
}));

app.use(helmet());
app.use(express.json());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-6",
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new ApiError(
      429,
      ERROR_CODES.TOO_MANY_REQUESTS,
      "Too many requests from this IP, please try again later."
    ));
  }
});

app.use(globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-6",
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new ApiError(
      429,
      ERROR_CODES.TOO_MANY_AUTH_ATTEMPTS,
      "Too many auth attempts. Brute force protection activated."
    ));
  }
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/hotels", hotelsRoutes);

app.use((req, res, next) => {
    next(new ApiError(
      404,
      ERROR_CODES.ENDPOINT_NOT_FOUND,
      `Path ${req.url} not found.`
    ));
});

app.use((err, req, res, next) => {
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
  } 
  else if (isDevelopment) {
    response.devMessage = err.message || "An unexpected server error occurred.";
  }

  res.status(statusCode).json(response);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`[LazyVacay Server] 🛡️ Secured Fort running on port ${PORT}`);
});