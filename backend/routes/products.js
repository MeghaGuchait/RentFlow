/**
 * routes/products.js
 * Routing for products catalog and inventory status verification/management.
 */

const { Router } = require("express");
const productController = require("../controllers/productController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = Router();

// Public routes
router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.get("/:id/availability", productController.checkAvailability);

// Admin-only product management routes
router.post("/", requireAuth, requireAdmin, productController.create);
router.put("/:id", requireAuth, requireAdmin, productController.update);
router.delete("/:id", requireAuth, requireAdmin, productController.remove);

// Admin-only inventory tracking routes
router.get("/:id/inventory", requireAuth, requireAdmin, productController.getInventoryItems);
router.put("/:id/inventory/:invId", requireAuth, requireAdmin, productController.updateInventorySlot);

module.exports = router;
