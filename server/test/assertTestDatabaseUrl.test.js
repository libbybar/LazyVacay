import { describe, expect, it } from "vitest";
import { assertTestDatabaseUrl } from "./assertTestDatabaseUrl.js";

const urlForDatabase = (databaseName) =>
  `postgresql://user:secret@host.example.com/${databaseName}?sslmode=require`;

describe("assertTestDatabaseUrl", () => {
  it("accepts a URL whose database is exactly lazyvacay_test", () => {
    expect(() =>
      assertTestDatabaseUrl("DATABASE_URL", urlForDatabase("lazyvacay_test"))
    ).not.toThrow();
  });

  it.each([
    ["the development database", "lazyvacay"],
    ["a name that only contains the test name", "lazyvacay_test_backup"],
    ["a name that ends with the test name", "prod_lazyvacay_test"],
    ["a different casing", "LazyVacay_Test"],
    ["no database at all", ""],
  ])("rejects %s", (_description, databaseName) => {
    expect(() =>
      assertTestDatabaseUrl("DATABASE_URL", urlForDatabase(databaseName))
    ).toThrow(/Refusing to run tests/);
  });

  it.each([
    ["undefined", undefined],
    ["a value that is not a URL", "not a url"],
  ])("rejects %s", (_description, connectionUrl) => {
    expect(() =>
      assertTestDatabaseUrl("DATABASE_URL", connectionUrl)
    ).toThrow(/Refusing to run tests/);
  });

  it("names the offending variable and never leaks the credentials", () => {
    const attempt = () =>
      assertTestDatabaseUrl("DIRECT_URL", urlForDatabase("lazyvacay"));

    expect(attempt).toThrow(/DIRECT_URL/);
    expect(attempt).not.toThrow(/secret/);
  });
});
