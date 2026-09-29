export const TEST_DATABASE_NAME = "lazyvacay_test";

export const assertTestDatabaseUrl = (variableName, connectionUrl) => {
  const databaseName = extractDatabaseName(connectionUrl);

  if (databaseName !== TEST_DATABASE_NAME) {
    throw new Error(
      `${variableName} must point to the "${TEST_DATABASE_NAME}" database ` +
      `but points to "${databaseName ?? "an unreadable URL"}". Refusing to run tests.`
    );
  }
};

const extractDatabaseName = (connectionUrl) => {
  try {
    return decodeURIComponent(new URL(connectionUrl).pathname.slice(1));
  } catch {
    return null;
  }
};
