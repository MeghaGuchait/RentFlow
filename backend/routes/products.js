/**
 * routes/products.js
 * Product and inventory routes — /api/products
 * Implemented in Stage 4: feat: add product and inventory APIs
 */

const { Router } = require("express");

const router = Router();

// Placeholder — routes will be implemented in Stage 4
router.all("*", (req, res) => {
  res.status(501).json({
    success: false,
    error: { message: "Product routes not yet implemented — coming in Stage 4." },
  });
});

module.exports = router;
