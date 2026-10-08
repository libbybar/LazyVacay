import { ERROR_CODES } from "../constants/errorCodes.js";
import { ApiError } from "./ApiError.js";

const hasMissingFields = (body, requiredFields) => { 
  return requiredFields.some((field) => body[field] === undefined || body[field] === null || body[field] === ''); 
};

export const validateHotelInput = (req, res, next) => { 
  const { name, country, city, stars } = req.body;
  
  if (hasMissingFields(req.body, ['name', 'country', 'city', 'stars'])) {
    return next(new ApiError(
      400,
      ERROR_CODES.MISSING_REQUIRED_FIELDS,
      "Name, country, city, and stars are all required fields."));
  }

  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    return next(new ApiError(
      400,
      ERROR_CODES.INVALID_HOTEL_INPUT,
      "Stars must be a whole number between 1 and 5."));
  }

  if (typeof name !== 'string' || typeof country !== 'string' || typeof city !== 'string') {
    return next(new ApiError(
      400,
      ERROR_CODES.INVALID_HOTEL_INPUT,
      "Name, country, and city must be valid strings."
    ));
  }

  if ([name, country, city].some((value) => value.trim() === '')) {
    return next(new ApiError(
      400,
      ERROR_CODES.INVALID_HOTEL_INPUT,
      "Name, country, and city cannot be blank."
    ));
  }

  next();
};

const UUID_REGEX =   /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateRoomInput = (req, res, next) => {
  const { name, size, maxGuests, price, hotelId } = req.body;

  if (hasMissingFields(req.body, ["name", "size", "maxGuests", "price", "hotelId"])) {
    return next(
      new ApiError(
        400,
        ERROR_CODES.MISSING_REQUIRED_FIELDS,
        "Name, size, maxGuests, price, and hotelId are required fields."
      )
    );
  }

  if (typeof name !== "string" || name.trim() === "") {
    return next(
      new ApiError(
        400,
        ERROR_CODES.INVALID_ROOM_INPUT,
        "Name must be a non-empty string."
      )
    );
  }

  if (typeof size !== "number" || size <= 0) {
    return next(
      new ApiError(
        400,
        ERROR_CODES.INVALID_ROOM_INPUT,
        "Size must be a positive number."
      )
    );
  }

  if (!Number.isInteger(maxGuests) || maxGuests <= 0) {
    return next(
      new ApiError(
        400,
        ERROR_CODES.INVALID_ROOM_INPUT,
        "maxGuests must be a positive integer."
      )
    );
  }

  if (typeof price !== "number" || price <= 0) {
    return next(
      new ApiError(
        400,
        ERROR_CODES.INVALID_PRICE,
        "Price must be a positive number."
      )
    );
  }

  if (typeof hotelId !== "string" || !UUID_REGEX.test(hotelId)) {
    return next(
      new ApiError(
        400,
        ERROR_CODES.INVALID_ROOM_INPUT,
        "hotelId must be a valid UUID."
      )
    );
  }

  next();
};