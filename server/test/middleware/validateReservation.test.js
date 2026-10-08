import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { validateReservation } from "../../middleware/validateReservation.js";
import { ApiError } from "../../middleware/ApiError.js";
import { runMiddleware } from "../helpers/runMiddleware.js";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const reservation = (overrides = {}) => ({
  roomId: "room-1",
  hotelId: "hotel-1",
  startDate: "2030-06-20",
  endDate: "2030-06-22",
  ...overrides,
});

const validate = (body) => runMiddleware(validateReservation, { body });

const expectBadRequest = ({ error }, errorCode) => {
  expect(error).toBeInstanceOf(ApiError);
  expect(error).toMatchObject({ statusCode: 400, errorCode });
};

const expectAccepted = ({ error, request }) => {
  expect(error).toBeUndefined();
  return request.validatedDates;
};

const setNow = (isoTimestamp) => vi.setSystemTime(new Date(isoTimestamp));

describe("validateReservation", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    setNow("2030-06-15T12:00:00Z");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each(["roomId", "hotelId", "startDate", "endDate"])("requires %s", (field) => {
    expectBadRequest(validate(reservation({ [field]: undefined })), "MISSING_REQUIRED_FIELDS");
  });

  describe("accepted date formats", () => {
    it.each([
      ["YYYY-MM-DD", "2030-06-20", "2030-06-22"],
      ["DD/MM/YYYY", "20/06/2030", "22/06/2030"],
      ["DD-MM-YYYY", "20-06-2030", "22-06-2030"],
    ])("reads %s as calendar days at UTC midnight", (_format, startDate, endDate) => {
      const { start, end } = expectAccepted(validate(reservation({ startDate, endDate })));

      expect(start.toISOString()).toBe("2030-06-20T00:00:00.000Z");
      expect(end.toISOString()).toBe("2030-06-22T00:00:00.000Z");
    });

    it("reads the first number of a day-first date as the day, not the month", () => {
      const { start } = expectAccepted(validate(reservation({ startDate: "07/08/2030", endDate: "09/08/2030" })));

      expect(start.toISOString()).toBe("2030-08-07T00:00:00.000Z");
    });
  });

  describe("rejected date formats", () => {
    it.each([
      ["a timestamp with a zone", "2030-06-20T10:00:00Z"],
      ["a timestamp without a zone", "2030-06-20T00:00:00"],
      ["a two digit year", "20/06/30"],
      ["slashes in a year-first date", "2030/06/20"],
      ["a written month", "June 20 2030"],
      ["mixed separators", "20/06-2030"],
      ["surrounding spaces", " 2030-06-20"],
      ["a number", 20300620],
      ["a day that does not exist in the month", "31/02/2030"],
      ["a year-first day that does not exist", "2030-02-30"],
      ["day zero", "00/06/2030"],
      ["month thirteen", "20/13/2030"],
      ["29 February in a common year", "29/02/2030"],
    ])("rejects %s", (_description, startDate) => {
      expectBadRequest(validate(reservation({ startDate })), "INVALID_DATE_FORMAT");
    });

    it("rejects a check-out date that is not valid", () => {
      expectBadRequest(validate(reservation({ endDate: "2030-06-31" })), "INVALID_DATE_FORMAT");
    });
  });

  describe("leap years and adjacent dates", () => {
    it("accepts 29 February in a leap year", () => {
      const { start } = expectAccepted(validate(reservation({ startDate: "2032-02-29", endDate: "2032-03-01" })));

      expect(start.toISOString()).toBe("2032-02-29T00:00:00.000Z");
    });

    it("counts the leap day as a night", () => {
      const { start, end } = expectAccepted(validate(reservation({ startDate: "2032-02-28", endDate: "2032-03-01" })));

      expect(end - start).toBe(2 * DAY_IN_MS);
    });

    it("accepts a one night stay with adjacent dates", () => {
      const { start, end } = expectAccepted(validate(reservation({ startDate: "2030-06-20", endDate: "2030-06-21" })));

      expect(end - start).toBe(DAY_IN_MS);
    });

    it.each([
      ["the Israeli and European", "2030-10-25", "2030-10-29"],
      ["the American", "2030-11-01", "2030-11-05"],
    ])("measures whole days across %s daylight saving change", (_region, startDate, endDate) => {
      const { start, end } = expectAccepted(validate(reservation({ startDate, endDate })));

      expect(end - start).toBe(4 * DAY_IN_MS);
    });

    it.each([
      ["the same day as the check-in", "2030-06-20"],
      ["a day before the check-in", "2030-06-19"],
    ])("rejects a check-out on %s", (_description, endDate) => {
      expectBadRequest(validate(reservation({ startDate: "2030-06-20", endDate })), "END_DATE_BEFORE_START_DATE");
    });
  });

  describe("past, present and future check-in", () => {
    it("rejects a check-in yesterday", () => {
      expectBadRequest(validate(reservation({ startDate: "2030-06-14", endDate: "2030-06-16" })), "PAST_BOOKING_DATE");
    });

    it("accepts a check-in today", () => {
      expectAccepted(validate(reservation({ startDate: "2030-06-15", endDate: "2030-06-16" })));
    });

    it("accepts a check-in tomorrow", () => {
      expectAccepted(validate(reservation({ startDate: "2030-06-16", endDate: "2030-06-17" })));
    });

    it("still counts today until the last moment of the UTC day", () => {
      setNow("2030-06-15T23:59:59.999Z");

      expectAccepted(validate(reservation({ startDate: "2030-06-15", endDate: "2030-06-16" })));
    });

    it("treats the day as over from the first moment of the next UTC day", () => {
      setNow("2030-06-16T00:00:00.000Z");

      expectBadRequest(validate(reservation({ startDate: "2030-06-15", endDate: "2030-06-17" })), "PAST_BOOKING_DATE");
    });
  });
});
