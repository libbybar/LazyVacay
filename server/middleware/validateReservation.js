import { ERROR_CODES } from "../constants/errorCodes.js";
import { ApiError } from "./ApiError.js";

const DAY_FIRST_DATE = /^(\d{2})([/-])(\d{2})\2(\d{4})$/;
const YEAR_FIRST_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export const validateReservation = (req, res, next) => {
  const { roomId, hotelId, startDate, endDate } = req.body;

  if (!roomId || !hotelId || !startDate || !endDate ) {
    return next(new ApiError(
      400,
      ERROR_CODES.MISSING_REQUIRED_FIELDS,
      "roomId, hotelId, startDate and endDate are all required."
    ));
  }

  const start = parseCalendarDate(startDate);
  const end = parseCalendarDate(endDate);

  if (!start || !end) {
    return next(new ApiError(
      400,
      ERROR_CODES.INVALID_DATE_FORMAT,
      "Dates must be an existing day in the format DD/MM/YYYY, DD-MM-YYYY or YYYY-MM-DD."
    ));
  }

  if (start >= end) {
    return next(new ApiError(
      400,
      ERROR_CODES.END_DATE_BEFORE_START_DATE,
      "Check-out date must be strictly after the check-in date."
    ));
  }

  if (start < getStartOfTodayUtc()) {
    return next(new ApiError(
      400,
      ERROR_CODES.PAST_BOOKING_DATE,
      "Cannot reserve a room for past dates."
    ));
  }

  req.validatedDates = { start, end };
  next();
};

const parseCalendarDate = (text) => {
  const dateParts = extractDateParts(text);

  return dateParts ? buildUtcDate(dateParts) : null;
};

const extractDateParts = (text) => {
  if (typeof text !== "string") return null;

  const dayFirst = DAY_FIRST_DATE.exec(text);
  if (dayFirst) {
    return { day: Number(dayFirst[1]), month: Number(dayFirst[3]), year: Number(dayFirst[4]) };
  }

  const yearFirst = YEAR_FIRST_DATE.exec(text);
  if (yearFirst) {
    return { year: Number(yearFirst[1]), month: Number(yearFirst[2]), day: Number(yearFirst[3]) };
  }

  return null;
};

const buildUtcDate = ({ year, month, day }) => {
  const date = new Date(Date.UTC(year, month - 1, day));
  const isExistingDay =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  return isExistingDay ? date : null;
};

const getStartOfTodayUtc = () => {
  const now = new Date();

  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};
