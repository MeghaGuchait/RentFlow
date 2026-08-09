/**
 * middleware/errorHandler.js
 * Global error-handling middleware.
 * Must be the LAST middleware registered in server.js (four parameters).
 *
 * In development, it returns the full stack trace.
 * In production, it returns a safe message only.
 */

const { getConfig } = require("../config/env");

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const { isDev } = getConfig();

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log to console in all environments — consider a proper logger (e.g. winston) later
  if (status >= 500) {
    console.error(`[errorHandler] ${status} — ${message}`);
    if (isDev) console.error(err.stack);
  }

  res.status(status).json({
    success: false,
    error: {
      message,
      ...(isDev && status >= 500 ? { stack: err.stack } : {}),
    },
  });
}

module.exports = { errorHandler };
