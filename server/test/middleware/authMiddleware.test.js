import jwt from "jsonwebtoken";
import { afterEach, describe, expect, it, vi } from "vitest";
import { requireAdmin, requireAuth } from "../../middleware/authMiddleware.js";
import { ApiError } from "../../middleware/ApiError.js";
import { runMiddleware } from "../helpers/runMiddleware.js";

const signToken = (payload, options) => jwt.sign(payload, process.env.JWT_SECRET, options);
const bearer = (token) => ({ headers: { authorization: `Bearer ${token}` } });
const toBase64Url = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");

const expectRejection = (error, statusCode, errorCode) => {
  expect(error).toBeInstanceOf(ApiError);
  expect(error).toMatchObject({ statusCode, errorCode });
};

describe("requireAuth", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("accepts a valid token and exposes its claims on the request", () => {
    const { error, request } = runMiddleware(
      requireAuth,
      bearer(signToken({ userId: "user-1", role: "USER" }))
    );

    expect(error).toBeUndefined();
    expect(request.user).toMatchObject({ userId: "user-1", role: "USER" });
  });

  it.each([
    ["no Authorization header", {}],
    ["an empty Authorization header", { authorization: "" }],
    ["a Basic scheme", { authorization: "Basic dXNlcjpwYXNz" }],
    ["a lowercase bearer scheme", { authorization: "bearer some-token" }],
    ["a token without a scheme", { authorization: "some-token" }],
  ])("asks the caller to log in when there is %s", (_description, headers) => {
    const { error, request } = runMiddleware(requireAuth, { headers });

    expectRejection(error, 401, "UNAUTHORIZED");
    expect(request.user).toBeUndefined();
  });

  it("accepts a token until it expires and reports TOKEN_EXPIRED afterwards", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2030-01-01T10:00:00Z"));
    const token = signToken({ userId: "user-1", role: "USER" }, { expiresIn: "2h" });

    vi.setSystemTime(new Date("2030-01-01T11:59:59Z"));
    expect(runMiddleware(requireAuth, bearer(token)).error).toBeUndefined();

    vi.setSystemTime(new Date("2030-01-01T12:00:01Z"));
    expectRejection(runMiddleware(requireAuth, bearer(token)).error, 401, "TOKEN_EXPIRED");
  });

  describe("tokens that cannot be trusted", () => {
    const validToken = () => signToken({ userId: "user-1", role: "USER" });
    const [header, , signature] = validToken().split(".");

    const untrustedTokens = [
      ["garbage", "not-a-jwt"],
      ["empty", ""],
      ["signed with another secret", jwt.sign({ userId: "user-1", role: "ADMIN" }, "another-secret")],
      ["unsigned (alg none)", jwt.sign({ userId: "user-1", role: "ADMIN" }, "", { algorithm: "none" })],
      [
        "carrying a forged payload under the original signature",
        `${header}.${toBase64Url({ userId: "user-1", role: "ADMIN" })}.${signature}`,
      ],
    ];

    it.each(untrustedTokens)(
      "rejects a token that is %s with the same generic answer",
      (_description, token) => {
        const { error, request } = runMiddleware(requireAuth, bearer(token));

        expectRejection(error, 401, "INVALID_TOKEN");
        expect(error.devMessage).toBe("Invalid authentication token.");
        expect(request.user).toBeUndefined();
      }
    );
  });
});

describe("requireAdmin", () => {
  it("lets an admin through", () => {
    const { error } = runMiddleware(requireAdmin, { user: { userId: "admin-1", role: "ADMIN" } });

    expect(error).toBeUndefined();
  });

  it.each([
    ["a regular user", { user: { userId: "u1", role: "USER" } }],
    ["a content creator", { user: { userId: "u2", role: "CONTENT_CREATOR" } }],
    ["a role with different casing", { user: { userId: "u3", role: "admin" } }],
    ["a user without a role", { user: { userId: "u4" } }],
    ["a request that was never authenticated", {}],
  ])("denies %s", (_description, requestOverrides) => {
    const { error } = runMiddleware(requireAdmin, requestOverrides);

    expectRejection(error, 403, "UNAUTHORIZED_ADMIN_ONLY");
  });
});
