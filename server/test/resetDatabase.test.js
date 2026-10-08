import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetDatabase } from "./resetDatabase.js";

const FAKE_TEST_DATABASE_URL = "postgresql://user:password@localhost:5432/lazyvacay_test";

const testDatabaseRow = [{ database: "lazyvacay_test" }];
const developmentDatabaseRow = [{ database: "lazyvacay" }];
const oneTableRow = [{ table_name: "User" }];

describe("resetDatabase safety", () => {
  beforeEach(() => vi.stubEnv("DATABASE_URL", FAKE_TEST_DATABASE_URL));
  afterEach(() => vi.unstubAllEnvs());

  it("refuses to truncate when the connection is not the test database", async () => {
    const connectedToDevelopment = {
      $queryRaw: vi.fn().mockResolvedValue(developmentDatabaseRow),
      $executeRawUnsafe: vi.fn(),
    };

    await expect(resetDatabase(connectedToDevelopment)).rejects.toThrow(
      /Refusing to reset the database/
    );
    expect(connectedToDevelopment.$executeRawUnsafe).not.toHaveBeenCalled();
  });

  it("verifies the connected database on every reset, not only the first", async () => {
    const connectionThatSwitchesDatabase = {
      $queryRaw: vi.fn()
        .mockResolvedValueOnce(testDatabaseRow)
        .mockResolvedValueOnce(oneTableRow)
        .mockResolvedValueOnce(developmentDatabaseRow),
      $executeRawUnsafe: vi.fn(),
    };

    await resetDatabase(connectionThatSwitchesDatabase);
    await expect(resetDatabase(connectionThatSwitchesDatabase)).rejects.toThrow(
      /Refusing to reset the database/
    );

    expect(connectionThatSwitchesDatabase.$executeRawUnsafe).toHaveBeenCalledTimes(1);
  });
});
