

export const ERROR_MESSAGES = {
  // General
  INTERNAL_SERVER_ERROR: "אירעה שגיאה במערכת",
  ENDPOINT_NOT_FOUND: "הדף המבוקש אינו קיים",
  RESOURCE_NOT_FOUND: "הפריט המבוקש לא נמצא",
  MISSING_REQUIRED_FIELDS: "יש למלא את כל השדות הנדרשים",

  // Validation
  INVALID_DATE_FORMAT: "פורמט התאריך אינו תקין",
  END_DATE_BEFORE_START_DATE: "תאריך העזיבה חייב להיות מאוחר מתאריך ההגעה",
  PAST_BOOKING_DATE: "לא ניתן לבצע הזמנה לתאריך שכבר חלף",
  INVALID_HOTEL_INPUT: "פרטי המלון אינם תקינים",
  INVALID_ROOM_INPUT: "פרטי החדר אינם תקינים",
  INVALID_PRICE: "המחיר שהוזן אינו תקין",
  INVALID_EMAIL_FORMAT: "כתובת האימייל אינה תקינה",
  WEAK_PASSWORD: "הסיסמה אינה עומדת בדרישות האבטחה",
  INVALID_USER_INPUT: "חלק מהנתונים שהוזנו אינם תקינים",

  // Auth
  EMAIL_ALREADY_EXISTS: "קיים חשבון עם כתובת אימייל זו",
  UNAUTHORIZED: "נדרשת כניסה למערכת",
  INVALID_CREDENTIALS: "כתובת האימייל או הסיסמה אינם תקינים",
  UNAUTHORIZED_ADMIN_ONLY: "נדרשות הרשאות ניהול לביצוע פעולה זו",
  INVALID_TOKEN: "פג תוקף ההתחברות או שהוא אינו תקין",
  TOKEN_EXPIRED: "נדרשת כניסה מחדש למערכת",
  USER_NOT_FOUND: "לא נמצא חשבון תואם",

  // Business Logic & Resources
  HOTEL_ALREADY_EXISTS: "מלון זה כבר קיים במערכת",

  // Rate limiting
  TOO_MANY_REQUESTS: "בוצעו יותר מדי בקשות, ניתן לנסות שוב בעוד מספר דקות",
  TOO_MANY_AUTH_ATTEMPTS: "בוצעו יותר מדי ניסיונות כניסה, ניתן לנסות שוב מאוחר יותר",

  // Booking / Reservation
  ROOM_ALREADY_BOOKED: "החדר אינו זמין בתאריכים שנבחרו",
  INVALID_ROOM_HOTEL_MATCH: "החדר שנבחר אינו שייך למלון זה"
};