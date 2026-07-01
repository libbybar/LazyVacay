import { ERROR_CODES } from "../constants/errorCodes.js";
import { ApiError } from "./ApiError.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
// TODO: Extract advanced email verification (DNS lookup) to a separate microservice/worker in the future.
// Basic regex is sufficient for MVP scope.

export const validateRegisterInput = (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return next(new ApiError(
      400,
      ERROR_CODES.MISSING_REQUIRED_FIELDS,
      "Email, password, firstName and lastName are all required fields."));
  }

  if (firstName.trim().length < 2) {
    return next(new ApiError(
      400,
      ERROR_CODES.INVALID_USER_INPUT,
      "First name must be at least 2 characters long."));
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return next(new ApiError(
      400,
      ERROR_CODES.INVALID_EMAIL_FORMAT,
      "Invalid email format."
    ));
  }

  if (password.length < 6) {
    return next(new ApiError(
      400,
      ERROR_CODES.WEAK_PASSWORD,
      "Password must be at least 6 characters long."
    ));
  }

  if (lastName && typeof lastName === 'string' && lastName.trim().length < 2) {
     return next(new ApiError(
       400,
       ERROR_CODES.INVALID_USER_INPUT,
       "Last name must be at least 2 characters long."
     ));
  }

  next();
};

export const validateProfileUpdate = (req, res, next) => {
  const { firstName, lastName, email } = req.body;

  if (!firstName || !email) {
    return next(new ApiError(
      400,
      ERROR_CODES.MISSING_REQUIRED_FIELDS,
      "First name and email are required fields."));
  }

  if (firstName.trim().length < 2) {
    return next(new ApiError(
      400,
      ERROR_CODES.INVALID_USER_INPUT,
      "First name must be at least 2 characters long."));
  }

  if (lastName && lastName.trim().length < 2) {
    return next(new ApiError(
      400,
      ERROR_CODES.INVALID_USER_INPUT,
      "Last name must be at least 2 characters long."));
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return next(new ApiError(
      400,
      ERROR_CODES.INVALID_EMAIL_FORMAT,
      "Invalid email format."));
  }

  next();
};