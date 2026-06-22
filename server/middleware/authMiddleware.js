import jwt from "jsonwebtoken";
import { ERROR_CODES } from "../constants/errorCodes.js";
import { ApiError } from "./ApiError.js";

export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ApiError(
        401,
        ERROR_CODES.UNAUTHORIZED,
        "Authentication required. Please log in."
      ));
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; 
    
    next(); 

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(
        401,
        ERROR_CODES.TOKEN_EXPIRED,
        "Your session has expired. Please log in again."
      ));
    }
    return next(new ApiError(
      401,
      ERROR_CODES.INVALID_TOKEN,
      "Invalid authentication token."
    ));
  }
};


export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return next(new ApiError(
      403,
      ERROR_CODES.UNAUTHORIZED_ADMIN_ONLY,
      "Access denied. Admin privileges required."
    ));
  }
  next();
};