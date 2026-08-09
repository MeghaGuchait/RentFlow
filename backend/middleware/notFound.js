/**
 * middleware/notFound.js
 * Catches any request that did not match a registered route
 * and returns a structured 404 JSON response.
 */

function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

module.exports = { notFound };
