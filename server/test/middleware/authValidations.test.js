import { describe, expect, it } from "vitest";
import {
  validateLoginInput,
  validateProfileUpdate,
  validateRegisterInput,
} from "../../middleware/authValidations.js";
import { ApiError } from "../../middleware/ApiError.js";
import { runMiddleware } from "../helpers/runMiddleware.js";

const registration = (overrides = {}) => ({
  email: "dana@example.com",
  password: "secret1",
  firstName: "Dana",
  lastName: "Levi",
  ...overrides,
});

const profile = (overrides = {}) => ({
  email: "dana@example.com",
  firstName: "Dana",
  lastName: "Levi",
  ...overrides,
});

const validate = (middleware, body) => runMiddleware(middleware, { body }).error;

const expectBadRequest = (error, errorCode) => {
  expect(error).toBeInstanceOf(ApiError);
  expect(error).toMatchObject({ statusCode: 400, errorCode });
};

const malformedEmails = [
  ["has no at sign", "dana.example.com"],
  ["has no local part", "@example.com"],
  ["has no domain", "dana@"],
  ["has no dot in the domain", "dana@example"],
  ["contains a space", "da na@example.com"],
];

describe("validateRegisterInput", () => {
  it("accepts a complete, valid registration", () => {
    expect(validate(validateRegisterInput, registration())).toBeUndefined();
  });

  it.each(["email", "password", "firstName", "lastName"])(
    "requires %s",
    (field) => {
      const error = validate(validateRegisterInput, registration({ [field]: undefined }));

      expectBadRequest(error, "MISSING_REQUIRED_FIELDS");
    }
  );

  it("treats an empty string as a missing required field", () => {
    const error = validate(validateRegisterInput, registration({ email: "" }));

    expectBadRequest(error, "MISSING_REQUIRED_FIELDS");
  });

  it.each(malformedEmails)("rejects an email that %s", (_description, email) => {
    expectBadRequest(validate(validateRegisterInput, registration({ email })), "INVALID_EMAIL_FORMAT");
  });

  it.each([
    ["surrounding spaces", "  dana@example.com  "],
    ["a plus tag and subdomains", "d.ana+trip@mail.example.co.il"],
  ])("accepts an email with %s", (_description, email) => {
    expect(validate(validateRegisterInput, registration({ email }))).toBeUndefined();
  });

  it("rejects a password of 5 characters and accepts one of 6", () => {
    expectBadRequest(validate(validateRegisterInput, registration({ password: "12345" })), "WEAK_PASSWORD");
    expect(validate(validateRegisterInput, registration({ password: "123456" }))).toBeUndefined();
  });

  it.each(["firstName", "lastName"])(
    "rejects a %s of 1 character or only spaces and accepts one of 2",
    (field) => {
      expectBadRequest(validate(validateRegisterInput, registration({ [field]: "D" })), "INVALID_USER_INPUT");
      expectBadRequest(validate(validateRegisterInput, registration({ [field]: "   " })), "INVALID_USER_INPUT");
      expect(validate(validateRegisterInput, registration({ [field]: "Da" }))).toBeUndefined();
    }
  );

  it("counts a name by its trimmed length", () => {
    const error = validate(validateRegisterInput, registration({ firstName: " D " }));

    expectBadRequest(error, "INVALID_USER_INPUT");
  });
});

const nonTextValues = [
  ["a number", 123456],
  ["zero", 0],
  ["an object", { value: "text" }],
  ["an array", ["text"]],
  ["true", true],
  ["false", false],
];

describe("validateRegisterInput with values that are not text", () => {
  it.each(nonTextValues)("rejects an email that is %s", (_description, email) => {
    expectBadRequest(validate(validateRegisterInput, registration({ email })), "INVALID_EMAIL_FORMAT");
  });

  it.each(["password", "firstName", "lastName", "phoneNumber"])(
    "rejects a %s that is not text",
    (field) => {
      for (const [, value] of nonTextValues) {
        expectBadRequest(validate(validateRegisterInput, registration({ [field]: value })), "INVALID_USER_INPUT");
      }
    }
  );

  it("does not require a phone number and accepts one as text", () => {
    for (const phoneNumber of [undefined, null, "", "050-1234567"]) {
      expect(validate(validateRegisterInput, registration({ phoneNumber }))).toBeUndefined();
    }
  });
});

describe("validateLoginInput", () => {
  const credentials = (overrides = {}) => ({ email: "dana@example.com", password: "secret1", ...overrides });

  it("accepts an email and a password", () => {
    expect(validate(validateLoginInput, credentials())).toBeUndefined();
  });

  it.each(["email", "password"])("requires %s", (field) => {
    expectBadRequest(validate(validateLoginInput, credentials({ [field]: undefined })), "MISSING_REQUIRED_FIELDS");
  });

  it.each(nonTextValues)("rejects an email that is %s", (_description, email) => {
    expectBadRequest(validate(validateLoginInput, credentials({ email })), "INVALID_EMAIL_FORMAT");
  });

  it.each(nonTextValues)("rejects a password that is %s", (_description, password) => {
    expectBadRequest(validate(validateLoginInput, credentials({ password })), "INVALID_USER_INPUT");
  });

  it("does not judge the shape of the email or the length of the password", () => {
    expect(validate(validateLoginInput, credentials({ email: "not-an-email", password: "x" }))).toBeUndefined();
  });
});

describe("validateProfileUpdate", () => {
  it("accepts a complete, valid profile", () => {
    expect(validate(validateProfileUpdate, profile())).toBeUndefined();
  });

  it.each(["firstName", "lastName", "email"])("requires %s", (field) => {
    const error = validate(validateProfileUpdate, profile({ [field]: undefined }));

    expectBadRequest(error, "MISSING_REQUIRED_FIELDS");
  });

  it("rejects an empty last name", () => {
    expectBadRequest(validate(validateProfileUpdate, profile({ lastName: "" })), "MISSING_REQUIRED_FIELDS");
  });

  it("rejects a first name or last name of 1 character and accepts 2", () => {
    expectBadRequest(validate(validateProfileUpdate, profile({ firstName: "D" })), "INVALID_USER_INPUT");
    expectBadRequest(validate(validateProfileUpdate, profile({ lastName: "L" })), "INVALID_USER_INPUT");
    expect(validate(validateProfileUpdate, profile({ firstName: "Da", lastName: "Le" }))).toBeUndefined();
  });

  it.each(malformedEmails)("rejects an email that %s", (_description, email) => {
    expectBadRequest(validate(validateProfileUpdate, profile({ email })), "INVALID_EMAIL_FORMAT");
  });

  it.each(nonTextValues)("rejects an email that is %s", (_description, email) => {
    expectBadRequest(validate(validateProfileUpdate, profile({ email })), "INVALID_EMAIL_FORMAT");
  });

  it.each(["firstName", "lastName", "phoneNumber"])("rejects a %s that is not text", (field) => {
    for (const [, value] of nonTextValues) {
      expectBadRequest(validate(validateProfileUpdate, profile({ [field]: value })), "INVALID_USER_INPUT");
    }
  });

  it("accepts a profile with or without a phone number", () => {
    for (const phoneNumber of [undefined, null, "", "050-1234567"]) {
      expect(validate(validateProfileUpdate, profile({ phoneNumber }))).toBeUndefined();
    }
  });
});
