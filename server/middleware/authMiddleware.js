import jwt from "jsonwebtoken";
import { ERROR_CODES } from "../constants/errorCodes.js";

export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: ERROR_CODES.UNAUTHORIZED,
        devMessage: "Authentication required. Please log in."
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; 
    
    next(); 

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: ERROR_CODES.TOKEN_EXPIRED,
        devMessage: "Your session has expired. Please log in again."
      });
    }
    return res.status(401).json({
      error: ERROR_CODES.INVALID_TOKEN,
      devMessage: "Invalid authentication token."
    });
  }
};


export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: ERROR_CODES.UNAUTHORIZED_ADMIN_ONLY,
      devMessage: "Access denied. Admin privileges required."
    });
  }
  next();
};