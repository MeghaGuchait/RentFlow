/**
 * routes/admin.js
 * Admin-only routes — /api/admin
 * Implemented in Stage 8: feat: complete admin backend integration
 */

const { Router } = require("express");

const router = Router();

// Placeholder — routes will be implemented in Stage 8
router.all("*", (req, res) => {
  res.status(501).json({
    success: false,
    error: { message: "Admin routes not yet implemented — coming in Stage 8." },
  });
});

module.exports = router;
