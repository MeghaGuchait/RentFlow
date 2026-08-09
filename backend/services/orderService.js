/**
 * services/orderService.js
 * Business logic for RentFlow orders, quotations, and rental lifecycle.
 */

const prisma = require("../config/database");
const productService = require("./productService");

/**
 * Generate a sequential order ID in format SOXXXX (e.g. SO0006)
 */
async function generateOrderId() {
  const count = await prisma.order.count();
  return `SO${String(count + 1).padStart(4, "0")}`;
}

/**
 * Create a new order or quotation.
 * Uses a transaction to ensure database consistency.
 */
async function createOrder(userId, userRole, orderData) {
  const {
    customerName,
    status = "reserved", // reserved, quotation, etc.
    pickupDate,
    returnDate,
    items = [], // array of { productId, qty }
    validityDays = 7,     // for quotations
    paymentTermsPct = 50, // for quotations
  } = orderData;

  // Basic validation
  if (!items || items.length === 0) {
    throw new Error("Order must contain at least one product item.");
  }
  if (!pickupDate || !returnDate) {
    throw new Error("Pickup date and return date are required.");
  }

  const start = new Date(pickupDate);
  const end = new Date(returnDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid pickup or return date format.");
  }
  if (start >= end) {
    throw new Error("Return date must be after pickup date.");
  }

  // Generate ID
  const orderId = await generateOrderId();

  // We perform inventory validation and order insertion in a database transaction
  return prisma.$transaction(async (tx) => {
    let orderTotal = 0;
    let totalDeposit = 0;
    const orderItemsToCreate = [];

    // 1. Process and validate each item
    for (const item of items) {
      const { productId, qty } = item;
      const parsedQty = Number(qty);

      if (!productId || isNaN(parsedQty) || parsedQty <= 0) {
        throw new Error("Product ID and a positive quantity are required.");
      }

      // Check product details
      const product = await tx.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        throw new Error(`Product not found with ID: ${productId}`);
      }

      // Calculate availability to prevent overbooking
      // Overlapping active orders: Order.pickupDate <= Request.returnDate AND Order.returnDate >= Request.pickupDate
      const totalStock = await tx.inventory.count({
        where: { productId, status: { not: "lost" } },
      });

      const overlappingItems = await tx.orderItem.findMany({
        where: {
          productId,
          order: {
            status: {
              notIn: ["returned", "late_return", "cancelled"],
            },
            pickupDate: { lte: end },
            returnDate: { gte: start },
          },
        },
        select: { qty: true },
      });

      const bookedQty = overlappingItems.reduce((acc, current) => acc + current.qty, 0);
      const availableQty = Math.max(0, totalStock - bookedQty);

      // If status is NOT quotation, enforce availability limit
      if (status !== "quotation" && parsedQty > availableQty) {
        throw new Error(
          `Insufficient inventory for product "${product.name}". Requested: ${parsedQty}, Available: ${availableQty}.`
        );
      }

      // Calculate totals based on periodicity
      let rentPrice = product.pricePerDay; // Default price fallback
      const rentalDurationMs = end - start;
      const rentalDays = Math.ceil(rentalDurationMs / (1000 * 60 * 60 * 24));

      if (product.periodicity === "hour") {
        const hours = Math.ceil(rentalDurationMs / (1000 * 60 * 60));
        rentPrice = product.pricePerHour * hours;
      } else if (product.periodicity === "week") {
        const weeks = Math.ceil(rentalDays / 7);
        rentPrice = product.pricePerWeek * weeks;
      } else {
        // Daily rate
        rentPrice = product.pricePerDay * rentalDays;
      }

      const itemTotal = rentPrice * parsedQty;
      orderTotal += itemTotal;
      totalDeposit += product.securityDeposit * parsedQty;

      // Find available physical inventory items to assign
      const availableInventoryItems = await tx.inventory.findMany({
        where: {
          productId,
          status: "available",
          // Avoid grabbing items that are booked in overlapping orders
          orderItems: {
            none: {
              order: {
                status: {
                  notIn: ["returned", "late_return", "cancelled"],
                },
                pickupDate: { lte: end },
                returnDate: { gte: start },
              },
            },
          },
        },
        take: parsedQty,
      });

      // Split the order item into qty of 1 for precise serial assignment
      for (let i = 0; i < parsedQty; i++) {
        const assignedInventory = availableInventoryItems[i];
        orderItemsToCreate.push({
          productId,
          qty: 1,
          priceSnapshot: rentPrice, // price per quantity unit
          inventoryId: assignedInventory ? assignedInventory.id : null,
        });
      }
    }

    // Set invoiceStatus matching front-end status flow
    let invoiceStatus = "invoiced";
    if (status === "quotation") invoiceStatus = "quotation_sent";
    if (status === "reserved") invoiceStatus = "confirmed";
    if (status === "picked_up") invoiceStatus = "invoiced";
    if (status === "cancelled") invoiceStatus = "nothing_to_invoice";

    // Create the order
    const order = await tx.order.create({
      data: {
        id: orderId,
        userId: userId || null,
        customerName: customerName || (userId ? "Registered Customer" : "Guest Customer"),
        status,
        pickupDate: start,
        returnDate: end,
        total: orderTotal,
        depositHeld: totalDeposit,
        invoiceStatus,
        orderItems: {
          create: orderItemsToCreate,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
            inventory: true,
          },
        },
      },
    });

    // Create quotation meta-record if order status is quotation
    if (status === "quotation") {
      await tx.quotation.create({
        data: {
          orderId: order.id,
          validityDays: Number(validityDays) || 7,
          paymentTermsPct: Number(paymentTermsPct) || 50,
        },
      });
    }

    return order;
  });
}

/**
 * Fetch orders list (with role check filters)
 */
async function getOrders(userId, userRole) {
  const where = {};

  // If user is a customer, only return their own orders
  if (userRole === "customer") {
    where.userId = userId;
  }

  return prisma.order.findMany({
    where,
    include: {
      orderItems: {
        include: {
          product: {
            select: { name: true, category: true, image: true },
          },
          inventory: {
            select: { serialNumber: true },
          },
        },
      },
      quotation: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Fetch a single order by ID with ownership validation
 */
async function getOrderById(id, userId, userRole) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: {
          product: true,
          inventory: true,
        },
      },
      quotation: true,
      returnDetails: true,
      settlement: true,
    },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  // Authorization check: customers cannot view other people's orders
  if (userRole === "customer" && order.userId !== userId) {
    throw new Error("Unauthorized. You do not have permission to view this order.");
  }

  return order;
}

/**
 * Admin: Update order status (Reserved, Picked Up, Returned, Cancelled, etc.)
 */
async function updateOrderStatus(id, status, extra = {}) {
  const existingOrder = await prisma.order.findUnique({
    where: { id },
  });

  if (!existingOrder) {
    throw new Error("Order not found.");
  }

  const validStatuses = [
    "quotation",
    "quotation_sent",
    "reserved",
    "picked_up",
    "late_pickup",
    "returned",
    "late_return",
    "cancelled",
  ];

  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}. Must be one of ${validStatuses.join(", ")}`);
  }

  // Adjust invoiceStatus based on orderStatus flow
  let invoiceStatus = existingOrder.invoiceStatus;
  if (status === "quotation_sent") invoiceStatus = "quotation_sent";
  if (status === "reserved") invoiceStatus = "confirmed";
  if (status === "picked_up") invoiceStatus = "invoiced";
  if (status === "cancelled") invoiceStatus = "nothing_to_invoice";

  return prisma.$transaction(async (tx) => {
    // If order is cancelled, we can set inventoryIds to null on all order items
    // to cleanly release reserved stocks
    if (status === "cancelled") {
      await tx.orderItem.updateMany({
        where: { orderId: id },
        data: { inventoryId: null },
      });
    }

    const updatedOrder = await tx.order.update({
      where: { id },
      data: {
        status,
        invoiceStatus,
        ...extra,
      },
      include: {
        orderItems: {
          include: {
            product: true,
            inventory: true,
          },
        },
      },
    });

    return updatedOrder;
  });
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
