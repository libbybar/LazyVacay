import { assertTestDatabaseUrl, TEST_DATABASE_NAME } from "./assertTestDatabaseUrl.js";

const MIGRATIONS_TABLE = "_prisma_migrations";

// The schema is fixed for the whole run (migrated once in globalSetup) and Neon round trips are slow,
// so table names are cached per client. The connected database is still verified on every reset.
const resettableTablesByClient = new WeakMap();

export const resetDatabase = async (prisma) => {
  assertTestDatabaseUrl("DATABASE_URL", process.env.DATABASE_URL);
  await assertConnectedToTestDatabase(prisma);

  const tableNames = await getResettableTables(prisma);

  if (tableNames.length > 0) {
    await prisma.$executeRawUnsafe(buildTruncateStatement(tableNames));
  }
};

const getResettableTables = async (prisma) => {
  if (!resettableTablesByClient.has(prisma)) {
    resettableTablesByClient.set(prisma, await listResettableTables(prisma));
  }

  return resettableTablesByClient.get(prisma);
};

const assertConnectedToTestDatabase = async (prisma) => {
  const [{ database }] = await prisma.$queryRaw`SELECT current_database() AS database`;

  if (database !== TEST_DATABASE_NAME) {
    throw new Error(
      `Connected to "${database}" instead of "${TEST_DATABASE_NAME}". Refusing to reset the database.`
    );
  }
};

const listResettableTables = async (prisma) => {
  const rows = await prisma.$queryRaw`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name <> ${MIGRATIONS_TABLE}`;

  return rows.map((row) => row.table_name);
};

const buildTruncateStatement = (tableNames) => {
  const quotedNames = tableNames.map((name) => `"${name}"`).join(", ");
  return `TRUNCATE TABLE ${quotedNames} RESTART IDENTITY CASCADE`;
};
