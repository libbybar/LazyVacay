import { describe, expect, it } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import prisma from "../../prismaClient.js";
import { createApp } from "../../app.js";
import { useCleanDatabase } from "../useCleanDatabase.js";

const app = createApp({ enableRateLimit: false });

const createUser = (overrides = {}) =>
  prisma.user.create({
    data: {
      email: "dana@example.com",
      password: "hashed",
      firstName: "Dana",
      lastName: "Levi",
      phoneNumber: "0501234567",
      ...overrides,
    },
  });

const signTokenFor = (user) => jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET);

const validProfile = (overrides = {}) => ({
  firstName: "Dana",
  lastName: "Levi",
  email: "dana@example.com",
  phoneNumber: "0501234567",
  ...overrides,
});

const patchProfile = (user, body) =>
  request(app).patch("/api/auth/profile").set("Authorization", `Bearer ${signTokenFor(user)}`).send(body);

const findStoredUser = (user) => prisma.user.findUnique({ where: { id: user.id } });

describe("PATCH /api/auth/profile", () => {
  useCleanDatabase();

  it("saves a valid update with trimmed names and a normalized email", async () => {
    const user = await createUser();

    const response = await patchProfile(
      user,
      validProfile({ firstName: "  Dina ", lastName: " Cohen  ", email: "  Dina@Example.COM ", phoneNumber: " 0529999999 " })
    );

    expect(response.status).toBe(200);
    const stored = await findStoredUser(user);
    expect(stored).toMatchObject({
      firstName: "Dina",
      lastName: "Cohen",
      email: "dina@example.com",
      phoneNumber: "0529999999",
    });
    expect(response.body.user).toEqual({
      id: user.id,
      email: "dina@example.com",
      firstName: "Dina",
      lastName: "Cohen",
      phoneNumber: "0529999999",
      role: "USER",
    });
  });

  it("lets a user keep their own email", async () => {
    const user = await createUser();

    const response = await patchProfile(user, validProfile({ firstName: "Dina" }));

    expect(response.status).toBe(200);
    expect((await findStoredUser(user)).firstName).toBe("Dina");
  });

  it.each([
    ["missing", undefined],
    ["empty", ""],
  ])("rejects a %s last name and leaves the stored profile untouched", async (_description, lastName) => {
    const user = await createUser();

    const response = await patchProfile(user, validProfile({ firstName: "Dina", lastName }));

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("MISSING_REQUIRED_FIELDS");
    expect(await findStoredUser(user)).toMatchObject({ firstName: "Dana", lastName: "Levi" });
  });

  it("refuses an email that belongs to another account and changes nothing", async () => {
    const user = await createUser();
    await createUser({ email: "taken@example.com" });

    const response = await patchProfile(user, validProfile({ firstName: "Dina", email: "taken@example.com" }));

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("EMAIL_ALREADY_EXISTS");
    expect(await findStoredUser(user)).toMatchObject({ firstName: "Dana", email: "dana@example.com" });
  });

  it("requires a logged-in user", async () => {
    const user = await createUser();

    const response = await request(app).patch("/api/auth/profile").send(validProfile({ firstName: "Dina" }));

    expect(response.status).toBe(401);
    expect((await findStoredUser(user)).firstName).toBe("Dana");
  });
});
