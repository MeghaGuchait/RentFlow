/**
 * controllers/productController.js
 * Express controllers handling API routes for products and inventory management.
 */

const productService = require("../services/productService");

/**
 * GET /api/products
 * Public: List all products (with optional search and category filters)
 */
async function getProducts(req, res, next) {
  try {
    const { category, search } = req.query;
    const products = await productService.getAllProducts({ category, search });
    res.json({
      success: true,
      data: products,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products/:id
 * Public: Get a single product by ID
 */
async function getProduct(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      error: { message: err.message },
    });
  }
}

/**
 * POST /api/products
 * Admin Only: Create a new product and populate inventory items
 */
async function create(req, res, next) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: { message: err.message },
    });
  }
}

/**
 * PUT /api/products/:id
 * Admin Only: Update product details and adjust inventory levels
 */
async function update(req, res, next) {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: { message: err.message },
    });
  }
}

/**
 * DELETE /api/products/:id
 * Admin Only: Delete a product
 */
async function remove(req, res, next) {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.json({
      success: true,
      message: "Product deleted successfully.",
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
 * GET /api/products/:id/availability
 * Public/Auth: Check product availability between pickupDate and returnDate
 */
async function checkAvailability(req, res, next) {
  try {
    const { pickupDate, returnDate } = req.query;
    const availability = await productService.checkProductAvailability(
      req.params.id,
      pickupDate,
      returnDate
    );
    res.json({
      success: true,
      data: availability,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: { message: err.message },
    });
  }
}

/**
 * GET /api/products/:id/inventory
 * Admin Only: Get tracked inventory items for a product
 * Note: If :id is "all", it returns all inventory items in the system.
 */
async function getInventoryItems(req, res, next) {
  try {
    const productId = req.params.id === "all" ? null : req.params.id;
    const inventory = await productService.getInventory(productId);
    res.json({
      success: true,
      data: inventory,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/products/:id/inventory/:invId
 * Admin Only: Update details or status of a specific inventory item
 */
async function updateInventorySlot(req, res, next) {
  try {
    const updatedSlot = await productService.updateInventoryItem(
      req.params.invId,
      req.body
    );
    res.json({
      success: true,
      message: "Inventory item updated successfully.",
      data: updatedSlot,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: { message: err.message },
    });
  }
}

module.exports = {
  getProducts,
  getProduct,
  create,
  update,
  remove,
  checkAvailability,
  getInventoryItems,
  updateInventorySlot,
};
