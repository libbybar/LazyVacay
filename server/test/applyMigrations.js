import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { loadTestEnv } from "./loadTestEnv.js";

const SERVER_DIRECTORY = fileURLToPath(new URL("..", import.meta.url));
const MIGRATION_TIMEOUT_MS = 120_000;
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 5_000;
const DATABASE_UNREACHABLE_CODE = "P1001";

export default async function applyMigrations() {
  const testEnv = loadTestEnv();

  for (let attempt = 1; ; attempt++) {
    try {
      runMigrateDeploy(testEnv);
      return;
    } catch (error) {
      if (!isDatabaseUnreachable(error) || attempt === MAX_ATTEMPTS) {
        throw error;
      }
      await delay(RETRY_DELAY_MS);
    }
  }
}

const runMigrateDeploy = (testEnv) =>
  execFileSync(process.execPath, [resolvePrismaCli(), "migrate", "deploy"], {
    cwd: SERVER_DIRECTORY,
    env: { ...process.env, ...testEnv },
    timeout: MIGRATION_TIMEOUT_MS,
    stdio: "pipe",
  });

const resolvePrismaCli = () =>
  createRequire(import.meta.url).resolve("prisma/build/index.js");

const isDatabaseUnreachable = (error) =>
  String(error.stderr).includes(DATABASE_UNREACHABLE_CODE);
