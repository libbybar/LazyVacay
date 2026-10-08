import { existsSync, readFileSync } from "node:fs";
import { parse } from "dotenv";
import { assertTestDatabaseUrl } from "./assertTestDatabaseUrl.js";

const TEST_ENV_FILE = new URL("../.env.test", import.meta.url);
const TEST_JWT_SECRET = "lazyvacay-test-jwt-secret";
const CONNECT_TIMEOUT_SECONDS = 30;

export const loadUnitTestEnv = () => ({ JWT_SECRET: TEST_JWT_SECRET });

export const loadTestEnv = () => {
  const fileValues = readTestEnvFile();

  assertTestDatabaseUrl("DATABASE_URL", fileValues.DATABASE_URL);
  assertTestDatabaseUrl("DIRECT_URL", fileValues.DIRECT_URL);

  return {
    ...fileValues,
    DATABASE_URL: withConnectTimeout(fileValues.DATABASE_URL),
    DIRECT_URL: withConnectTimeout(fileValues.DIRECT_URL),
    JWT_SECRET: TEST_JWT_SECRET,
  };
};

const readTestEnvFile = () => {
  if (!existsSync(TEST_ENV_FILE)) {
    throw new Error(
      "server/.env.test is missing. Copy server/.env.test.example and point it to the lazyvacay_test database."
    );
  }

  return parse(readFileSync(TEST_ENV_FILE));
};

// A suspended Neon database needs several seconds to wake up; Prisma's default connect timeout is 5.
const withConnectTimeout = (connectionUrl) => {
  if (connectionUrl.includes("connect_timeout=")) {
    return connectionUrl;
  }

  const separator = connectionUrl.includes("?") ? "&" : "?";
  return `${connectionUrl}${separator}connect_timeout=${CONNECT_TIMEOUT_SECONDS}`;
};
