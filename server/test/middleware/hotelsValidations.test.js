import { describe, expect, it } from "vitest";
import { validateHotelInput, validateRoomInput } from "../../middleware/hotelsValidations.js";
import { ApiError } from "../../middleware/ApiError.js";
import { runMiddleware } from "../helpers/runMiddleware.js";

const VALID_HOTEL_ID = "3f2b8c4e-9a1d-4e6f-8b7a-1c2d3e4f5a6b";

const hotel = (overrides = {}) => ({
  name: "Sea View",
  country: "Israel",
  city: "Eilat",
  stars: 4,
  ...overrides,
});

const room = (overrides = {}) => ({
  name: "Deluxe",
  size: 25,
  maxGuests: 2,
  price: 500,
  hotelId: VALID_HOTEL_ID,
  ...overrides,
});

const validate = (middleware, body) => runMiddleware(middleware, { body }).error;

const expectBadRequest = (error, errorCode) => {
  expect(error).toBeInstanceOf(ApiError);
  expect(error).toMatchObject({ statusCode: 400, errorCode });
};

describe("validateHotelInput", () => {
  it("accepts a complete, valid hotel", () => {
    expect(validate(validateHotelInput, hotel())).toBeUndefined();
  });

  it.each(["name", "country", "city", "stars"])("requires %s", (field) => {
    for (const emptyValue of [undefined, null, ""]) {
      const error = validate(validateHotelInput, hotel({ [field]: emptyValue }));

      expectBadRequest(error, "MISSING_REQUIRED_FIELDS");
    }
  });

  it("accepts stars from 1 to 5 and rejects 0 and 6", () => {
    for (const stars of [1, 5]) {
      expect(validate(validateHotelInput, hotel({ stars }))).toBeUndefined();
    }
    for (const stars of [0, 6, -1]) {
      expectBadRequest(validate(validateHotelInput, hotel({ stars })), "INVALID_HOTEL_INPUT");
    }
  });

  it.each([
    ["text", "4"],
    ["a fraction", 3.5],
  ])("rejects stars that are %s", (_description, stars) => {
    expectBadRequest(validate(validateHotelInput, hotel({ stars })), "INVALID_HOTEL_INPUT");
  });

  it.each(["name", "country", "city"])("rejects a %s made only of spaces", (field) => {
    expectBadRequest(validate(validateHotelInput, hotel({ [field]: "   " })), "INVALID_HOTEL_INPUT");
  });

  it("accepts a name with spaces around real text", () => {
    expect(validate(validateHotelInput, hotel({ name: "  Sea View  " }))).toBeUndefined();
  });

  it.each(["name", "country", "city"])("rejects a %s that is not text", (field) => {
    expectBadRequest(validate(validateHotelInput, hotel({ [field]: 123 })), "INVALID_HOTEL_INPUT");
  });
});

describe("validateRoomInput", () => {
  it("accepts a complete, valid room", () => {
    expect(validate(validateRoomInput, room())).toBeUndefined();
  });

  it.each(["name", "size", "maxGuests", "price", "hotelId"])("requires %s", (field) => {
    for (const emptyValue of [undefined, null, ""]) {
      const error = validate(validateRoomInput, room({ [field]: emptyValue }));

      expectBadRequest(error, "MISSING_REQUIRED_FIELDS");
    }
  });

  it.each([
    ["a number", 123],
    ["only spaces", "   "],
  ])("rejects a name that is %s", (_description, name) => {
    expectBadRequest(validate(validateRoomInput, room({ name })), "INVALID_ROOM_INPUT");
  });

  it.each([
    ["zero", 0],
    ["negative", -5],
    ["text", "25"],
  ])("rejects a size that is %s", (_description, size) => {
    expectBadRequest(validate(validateRoomInput, room({ size })), "INVALID_ROOM_INPUT");
  });

  it("accepts a fractional size", () => {
    expect(validate(validateRoomInput, room({ size: 22.5 }))).toBeUndefined();
  });

  it.each([
    ["zero", 0],
    ["negative", -1],
    ["fractional", 1.5],
    ["text", "2"],
  ])("rejects maxGuests that is %s", (_description, maxGuests) => {
    expectBadRequest(validate(validateRoomInput, room({ maxGuests })), "INVALID_ROOM_INPUT");
  });

  it.each([
    ["zero", 0],
    ["negative", -100],
    ["text", "500"],
  ])("rejects a price that is %s with the price error", (_description, price) => {
    expectBadRequest(validate(validateRoomInput, room({ price })), "INVALID_PRICE");
  });

  it("accepts a fractional price", () => {
    expect(validate(validateRoomInput, room({ price: 199.9 }))).toBeUndefined();
  });

  it.each([
    ["not a UUID", "hotel-1"],
    ["a UUID with a wrong version digit", "3f2b8c4e-9a1d-9e6f-8b7a-1c2d3e4f5a6b"],
    ["a number", 42],
  ])("rejects a hotelId that is %s", (_description, hotelId) => {
    expectBadRequest(validate(validateRoomInput, room({ hotelId })), "INVALID_ROOM_INPUT");
  });

  it("accepts a UUID in upper case", () => {
    expect(validate(validateRoomInput, room({ hotelId: VALID_HOTEL_ID.toUpperCase() }))).toBeUndefined();
  });
});
