import { describe, expect, it, vi } from "vitest";
import { resetDatabase } from "./resetDatabase.js";

const testDatabaseRow = [{ database: "lazyvacay_test" }];
const developmentDatabaseRow = [{ database: "lazyvacay" }];
const oneTableRow = [{ table_name: "User" }];

describe("resetDatabase safety", () => {
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
