/**
 * middleware/requestLogger.js
 * HTTP request logger using morgan.
 * In development: coloured 'dev' format.
 * In production: 'combined' Apache-style format.
 */

const morgan = require("morgan");
const { getConfig } = require("../config/env");

function createRequestLogger() {
  const { isDev } = getConfig();
  return morgan(isDev ? "dev" : "combined");
}

module.exports = { createRequestLogger };
