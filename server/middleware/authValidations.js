import { ERROR_CODES } from "../constants/errorCodes.js";
import { ApiError } from "./ApiError.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isText = (value) => typeof value === "string";

const isProvided = (value) => value !== undefined && value !== null;

const isMissing = (value) => !isProvided(value) || value === "";

const createInvalidTypeError = ({ email, requiredTexts, optionalTexts }) => {
  if (!isText(email)) {
    return new ApiError(
      400,
      ERROR_CODES.INVALID_EMAIL_FORMAT,
      "Email must be text."
    );
  }

  const hasWrongType =
    requiredTexts.some((value) => !isText(value)) ||
    optionalTexts.some((value) => isProvided(value) && !isText(value));

  return hasWrongType
    ? new ApiError(
        400,
        ERROR_CODES.INVALID_USER_INPUT,
        "Password, names and phone number must be text."
      )
    : null;
};

export const validateRegisterInput = (req, res, next) => {
  const { email, password, firstName, lastName, phoneNumber } = req.body;

  if ([email, password, firstName, lastName].some(isMissing)) {
    return next(new ApiError(
      400,
      ERROR_CODES.MISSING_REQUIRED_FIELDS,
      "Email, password, firstName and lastName are all required fields."));
  }

  const invalidTypeError = createInvalidTypeError({
    email,
    requiredTexts: [password, firstName, lastName],
    optionalTexts: [phoneNumber],
  });

  if (invalidTypeError) {
    return next(invalidTypeError);
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

export const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;

  if ([email, password].some(isMissing)) {
    return next(new ApiError(
      400,
      ERROR_CODES.MISSING_REQUIRED_FIELDS,
      "Email and password are required."));
  }

  const invalidTypeError = createInvalidTypeError({
    email,
    requiredTexts: [password],
    optionalTexts: [],
  });

  if (invalidTypeError) {
    return next(invalidTypeError);
  }

  next();
};

export const validateProfileUpdate = (req, res, next) => {
  const { firstName, lastName, email, phoneNumber } = req.body;

  if ([firstName, lastName, email].some(isMissing)) {
    return next(new ApiError(
      400,
      ERROR_CODES.MISSING_REQUIRED_FIELDS,
      "First name, last name and email are required fields."));
  }

  const invalidTypeError = createInvalidTypeError({
    email,
    requiredTexts: [firstName, lastName],
    optionalTexts: [phoneNumber],
  });

  if (invalidTypeError) {
    return next(invalidTypeError);
  }

  if (firstName.trim().length < 2) {
    return next(new ApiError(
      400,
      ERROR_CODES.INVALID_USER_INPUT,
      "First name must be at least 2 characters long."));
  }

  if (lastName.trim().length < 2) {
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
