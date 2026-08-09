/**
 * routes/orders.js
 * Routing for Sales Orders and Rental lifecycle management.
 */

const { Router } = require("express");
const orderController = require("../controllers/orderController");
const settlementController = require("../controllers/settlementController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = Router();

// Routes protecting access to logged-in users (customers/admins)
router.post("/", requireAuth, orderController.create);
router.get("/", requireAuth, orderController.list);
router.get("/:id", requireAuth, orderController.get);
router.get("/:id/settlement", requireAuth, settlementController.getSettlement);

// Admin-only order status transition routes
router.patch("/:id/status", requireAuth, requireAdmin, orderController.updateStatus);
router.post("/:id/return", requireAuth, requireAdmin, settlementController.processReturn);

module.exports = router;
