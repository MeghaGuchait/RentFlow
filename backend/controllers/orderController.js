/**
 * controllers/orderController.js
 * Express controllers handling API routes for sales orders and rental lifecycle management.
 */

const orderService = require("../services/orderService");

/**
 * POST /api/orders
 * Customer/Admin: Create a new order or quotation request
 */
async function create(req, res, next) {
  try {
    // If authenticated user is present, bind userId
    const userId = req.user ? req.user.id : null;
    const userRole = req.user ? req.user.role : null;

    const newOrder = await orderService.createOrder(userId, userRole, req.body);
    res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: newOrder,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: { message: err.message },
    });
  }
}

/**
 * GET /api/orders
 * List orders: customers retrieve own list, admins retrieve everything
 */
async function list(req, res, next) {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const orders = await orderService.getOrders(userId, userRole);
    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/orders/:id
 * Retrieve a specific order detail (enforces ownership checks)
 */
async function get(req, res, next) {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const order = await orderService.getOrderById(req.params.id, userId, userRole);
    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    const status = err.message.includes("Unauthorized") ? 403 : 404;
    res.status(status).json({
      success: false,
      error: { message: err.message },
    });
  }
}

/**
 * PATCH /api/orders/:id/status
 * Admin Only: Update an order status (e.g. reserve, pickup, cancel)
 */
async function updateStatus(req, res, next) {
  try {
    const { status, ...extra } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        error: { message: "Status is required." },
      });
    }

    const updatedOrder = await orderService.updateOrderStatus(
      req.params.id,
      status,
      extra
    );
    res.json({
      success: true,
      message: `Order status updated to "${status}".`,
      data: updatedOrder,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: { message: err.message },
    });
  }
}

module.exports = {
  create,
  list,
  get,
  updateStatus,
};
