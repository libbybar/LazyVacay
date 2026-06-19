import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";
import { ERROR_CODES } from "./constants/errorCodes.js";
import authRoutes from "./routes/authRoutes.js";
import hotelsRoutes from "./routes/hotelsRoutes.js";

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
  message: {
    error: ERROR_CODES.TOO_MANY_REQUESTS,
    devMessage: "Too many requests from this IP, please try again later."
  }
});

app.use(globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-6",
  legacyHeaders: false,
  message: {
    error: ERROR_CODES.TOO_MANY_AUTH_ATTEMPTS,
    devMessage: "Too many auth attempts. Brute force protection activated."
  }
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/hotels", hotelsRoutes);

app.use((req, res) => {
    res.status(404).json({
        error: ERROR_CODES.ENDPOINT_NOT_FOUND,
        devMessage: isDevelopment ? `Path ${req.url} not found.` : "The requested resource was not found."
    });
});

app.use((err, req, res, next) => {
    console.error("[Server Error]:", err.stack);

    res.status(500).json({
        error: ERROR_CODES.INTERNAL_SERVER_ERROR,
        devMessage: isDevelopment ? err.message : "An unexpected server error occurred."
    });
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`[LazyVacay Server] 🛡️ Secured Fort running on port ${PORT}`);
});