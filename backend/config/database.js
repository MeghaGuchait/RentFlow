/**
 * config/database.js
 * Initializes and exposes the Prisma client instance.
 * For Prisma 7, we explicitly configure and pass the BetterSqlite3 driver adapter.
 */

const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const path = require("path");
const fs = require("fs");
const { getConfig } = require("./env");

const config = getConfig();

const dbUrl = config.database.url;
let dbPath = dbUrl;
if (dbPath.startsWith("file:")) {
  dbPath = dbPath.slice(5);
}

// Resolve path relative to the backend directory (database.js is in config/)
const resolvedDbPath = path.resolve(__dirname, "..", dbPath);

// Ensure the SQLite database directory exists
const dbDir = path.dirname(resolvedDbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create adapter using the url configuration object for PrismaBetterSqlite3
const adapter = new PrismaBetterSqlite3({
  url: resolvedDbPath,
});

const prisma = new PrismaClient({
  adapter,
  log: config.isDev ? ["query", "info", "warn", "error"] : ["error"],
});

module.exports = prisma;
