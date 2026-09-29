const configuredTimeZone = process.env.TEST_TIME_ZONE;

if (configuredTimeZone) {
  process.env.TZ = configuredTimeZone;
}
