import { ERROR_CODES } from "../constants/errorCodes.js";

const APPROVED_DOMAINS_REGEX = /^[^\s@]+@(gmail|hotmail|yahoo|walla|outlook|icloud)\.[a-z]{2,}$/i;

export const validateRegisterInput = (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName) {
    return res.status(400).json({
      error: ERROR_CODES.MISSING_REQUIRED_FIELDS,
      devMessage: "Email, password, and firstName are all required fields."
    });
  }

  if (firstName.trim().length < 2) {
    return res.status(400).json({
      error: ERROR_CODES.INVALID_USER_INPUT, 
      devMessage: "First name must be at least 2 characters long."
    });
  }

  if (!APPROVED_DOMAINS_REGEX.test(email.trim())) {
    return res.status(400).json({
      error: ERROR_CODES.INVALID_EMAIL_FORMAT,
      devMessage: "Please provide a valid email address from a recognized provider (e.g., Gmail, Hotmail, Walla, Yahoo, Outlook)."
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: ERROR_CODES.WEAK_PASSWORD,
      devMessage: "Password must be at least 6 characters long."
    });
  }

  next(); 
};