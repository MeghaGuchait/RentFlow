/**
 * config/env.js
 * Loads and validates environment variables for the RentFlow backend.
 * Call loadEnv() once at the very start of server.js before anything else.
 */

const path = require("path");

function loadEnv() {
  // Load .env file if present (ignored if not found — prod envs inject vars directly)
  require("dotenv").config({ path: path.join(__dirname, "../.env") });

  const required = ["JWT_SECRET"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0 && process.env.NODE_ENV === "production") {
    console.error(
      `[env] FATAL: Missing required environment variables: ${missing.join(", ")}`
    );
    process.exit(1);
  } else if (missing.length > 0) {
    console.warn(
      `[env] WARNING: Missing env vars (${missing.join(", ")}) — using defaults for development.`
    );
  }
}

/**
 * Centralised config object so every module imports from here
 * instead of reading process.env directly.
 */
function getConfig() {
  return {
    port: parseInt(process.env.PORT || "4000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    isDev: (process.env.NODE_ENV || "development") === "development",

    jwt: {
      secret: process.env.JWT_SECRET || "dev_secret_change_in_production",
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    },

    database: {
      url: process.env.DATABASE_URL || "file:./data/rentflow.db",
    },

    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    },

    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
      max: parseInt(process.env.RATE_LIMIT_MAX || "200", 10),
    },
  };
}

module.exports = { loadEnv, getConfig };
