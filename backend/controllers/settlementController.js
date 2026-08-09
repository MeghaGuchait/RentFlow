/**
 * controllers/settlementController.js
 * Express controllers handling API routes for returns processing and late-fee settlements.
 */

const settlementService = require("../services/settlementService");

/**
 * POST /api/orders/:id/return
 * Admin Only: Process order return, perform server-side calculations, and save settlement
 */
async function processReturn(req, res, next) {
  try {
    const orderId = req.params.id;
    const result = await settlementService.processReturnAndSettlement(orderId, req.body);
    res.json({
      success: true,
      message: "Order return and settlement processed successfully.",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: { message: err.message },
    });
  }
}

/**
 * GET /api/orders/:id/settlement
 * Customer/Admin: Fetch details of a finalized order settlement
 */
async function getSettlement(req, res, next) {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    const details = await settlementService.getSettlementDetails(orderId, userId, userRole);
    res.json({
      success: true,
      data: details,
    });
  } catch (err) {
    const status = err.message.includes("Unauthorized") ? 403 : 404;
    res.status(status).json({
      success: false,
      error: { message: err.message },
    });
  }
}

module.exports = {
  processReturn,
  getSettlement,
};
