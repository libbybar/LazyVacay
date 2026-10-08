const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const getUtcCalendarDay = (dateValue) =>
  Math.floor(new Date(dateValue).getTime() / MILLISECONDS_PER_DAY);

export const hasReservationEnded = (endDateValue) =>
  getUtcCalendarDay(endDateValue) < getUtcCalendarDay(Date.now());
