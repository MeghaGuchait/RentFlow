/**
 * prisma.config.js
 * Centralized configuration file for Prisma 7.
 * Connects the schema, better-sqlite3 adapter, and migrations seed script.
 */

require("dotenv").config();
const { defineConfig } = require("prisma/config");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbUrl = process.env.DATABASE_URL || "file:../data/rentflow.db";
let dbPath = dbUrl;
if (dbPath.startsWith("file:")) {
  dbPath = dbPath.slice(5);
}

// Resolve the DB file path relative to this configuration file
const resolvedDbPath = path.resolve(__dirname, dbPath);

// Ensure the directory exists
const dbDir = path.dirname(resolvedDbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create connection using the adapter option
const adapter = new PrismaBetterSqlite3({
  url: resolvedDbPath,
});

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: dbUrl,
    adapter: adapter,
  },
  migrations: {
    seed: "node prisma/seed.js",
  },
});
