/**
 * routes/auth.js
 * Authentication routes — POST /api/auth/register, /login, GET /api/auth/me
 * Implemented in Stage 3: feat: add authentication and authorization
 */

const { Router } = require("express");

const router = Router();

// Placeholder — routes will be implemented in Stage 3
router.all("*", (req, res) => {
  res.status(501).json({
    success: false,
    error: { message: "Auth routes not yet implemented — coming in Stage 3." },
  });
});

module.exports = router;
