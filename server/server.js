import dotenv from "dotenv";
import { createApp } from "./app.js";

dotenv.config();

const REQUIRED_ENV_VARS = ["DATABASE_URL", "JWT_SECRET"];
const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
  console.error(`[LazyVacay Server] Missing required environment variables: ${missingVars.join(", ")}`);
  process.exit(1);
}

const app = createApp();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`[LazyVacay Server] 🛡️ Secured Fort running on port ${PORT}`);
});
