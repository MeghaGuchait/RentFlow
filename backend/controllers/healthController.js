/**
 * controllers/healthController.js
 * Thin controller for the /api/health endpoint.
 * Keeps route files clean — logic lives here.
 */

function getHealth(req, res) {
  res.json({
    success: true,
    status: "ok",
    service: "rentflow-backend",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
}

module.exports = { getHealth };
