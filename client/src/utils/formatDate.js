// Reservation dates are calendar days stored at UTC midnight, so they are
// displayed in UTC to show the same day in every time zone.
export const formatDate = (dateValue) => {
  if (!dateValue) return "";

  return new Date(dateValue).toLocaleDateString("he-IL", { timeZone: "UTC" });
};
