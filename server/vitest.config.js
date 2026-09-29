import { configDefaults, defineConfig } from "vitest/config";
import { loadTestEnv } from "./test/loadTestEnv.js";

const NEON_COLD_START_TIMEOUT_MS = 60_000;
const DATABASE_TEST_PATTERN = "test/**/*.db.test.js";

export default defineConfig({
  test: {
    env: loadTestEnv(),
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: ["test/**/*.test.js"],
          exclude: [...configDefaults.exclude, DATABASE_TEST_PATTERN],
          setupFiles: ["./test/setup/useConfiguredTimeZone.js"],
        },
      },
      {
        extends: true,
        test: {
          name: "database",
          environment: "node",
          include: [DATABASE_TEST_PATTERN],
          globalSetup: ["./test/applyMigrations.js"],
          fileParallelism: false,
          testTimeout: NEON_COLD_START_TIMEOUT_MS,
          hookTimeout: NEON_COLD_START_TIMEOUT_MS,
        },
      },
    ],
  },
});
