/**
 * routes/health.js
 * GET /api/health
 *
 * Returns a simple health-check payload so orchestrators, CI pipelines,
 * and the frontend API layer can confirm the backend is running.
 */

const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    service: "rentflow-backend",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

module.exports = router;
