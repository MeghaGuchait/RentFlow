/**
 * routes/orders.js
 * Rental order routes — /api/orders
 * Implemented in Stage 5: feat: add rental and order APIs
 */

const { Router } = require("express");

const router = Router();

// Placeholder — routes will be implemented in Stage 5
router.all("*", (req, res) => {
  res.status(501).json({
    success: false,
    error: { message: "Order routes not yet implemented — coming in Stage 5." },
  });
});

module.exports = router;
