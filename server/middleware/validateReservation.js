import { ERROR_CODES } from "../constants/errorCodes.js";

function parseFlexibleDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return null;
  if (/^\d{2}[/-]\d{2}[/-]\d{4}$/.test(dateStr)) {
    const parts = dateStr.split(/[/-]/);
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
      return date;
    }
    return null;
  }
  const date = new Date(dateStr);
  if (date instanceof Date && !isNaN(date.getTime())) {
    return date;
  }
  return null;
}

export const validateReservation = (req, res, next) => {
  const { roomId, hotelId, startDate, endDate } = req.body;

  if (!roomId || !hotelId || !startDate || !endDate ) {
    return res.status(400).json({
      error: ERROR_CODES.MISSING_REQUIRED_FIELDS,
      devMessage: "roomId, hotelId, startDate and endDate are all required."
    });
  }

  const start = parseFlexibleDate(startDate);
  const end = parseFlexibleDate(endDate);

  if (!start || !end) {
    return res.status(400).json({
      error: ERROR_CODES.INVALID_DATE_FORMAT,
      devMessage: "Dates must be in a valid format (DD/MM/YYYY or YYYY-MM-DD)."
    });
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (start >= end) {
    return res.status(400).json({
      error: ERROR_CODES.END_DATE_BEFORE_START_DATE,
      devMessage: "Check-out date must be strictly after the check-in date."
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (start < today) {
    return res.status(400).json({
      error: ERROR_CODES.PAST_BOOKING_DATE,
      devMessage: "Cannot reserve a room for past dates."
    });
  }

  req.validatedDates = { start, end };
  next();
};