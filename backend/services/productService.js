/**
 * services/productService.js
 * Business logic for Products and Inventory.
 */

const prisma = require("../config/database");

/**
 * Fetch all products, with optional filters
 */
async function getAllProducts({ category, search }) {
  const where = {};

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  // Parse variants JSON string for each product
  return products.map((p) => ({
    ...p,
    variants: p.variants ? JSON.parse(p.variants) : {},
  }));
}

/**
 * Fetch product by ID
 */
async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  return {
    ...product,
    variants: product.variants ? JSON.parse(product.variants) : {},
  };
}

/**
 * Admin: Create a new product and populate its initial inventory items
 */
async function createProduct(data) {
  const {
    name,
    category,
    image,
    pricePerDay,
    pricePerHour,
    pricePerWeek,
    securityDeposit,
    inStock = 0,
    variants = {},
    description,
    periodicity = "day",
    pickupTime = "09:00",
    returnTime = "18:00",
    paddingHours = 1.0,
    lateFeePerHour = 10.0,
    gracePeriodHours = 1.0,
    maxLateFee = 200.0,
  } = data;

  if (!name || !category || inStock < 0) {
    throw new Error("Name, category, and a non-negative stock count are required.");
  }

  // Create product
  const product = await prisma.product.create({
    data: {
      name,
      category,
      image: image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      pricePerDay: Number(pricePerDay) || 0,
      pricePerHour: Number(pricePerHour) || 0,
      pricePerWeek: Number(pricePerWeek) || 0,
      securityDeposit: Number(securityDeposit) || 0,
      inStock: Number(inStock) || 0,
      variants: typeof variants === "string" ? variants : JSON.stringify(variants),
      description: description || "",
      periodicity,
      pickupTime,
      returnTime,
      paddingHours: Number(paddingHours) || 0,
      lateFeePerHour: Number(lateFeePerHour) || 0,
      gracePeriodHours: Number(gracePeriodHours) || 0,
      maxLateFee: Number(maxLateFee) || 0,
    },
  });

  // Automatically create serial-tracked inventories
  const stockCount = Number(inStock);
  const serials = [];
  for (let i = 1; i <= stockCount; i++) {
    serials.push({
      productId: product.id,
      serialNumber: `${product.id.slice(0, 8).toUpperCase()}-SN-${String(i).padStart(3, "0")}`,
      status: "available",
    });
  }

  if (serials.length > 0) {
    await prisma.inventory.createMany({
      data: serials,
    });
  }

  return {
    ...product,
    variants: typeof variants === "string" ? JSON.parse(variants) : variants,
  };
}

/**
 * Admin: Update an existing product and adjust its inventories if inStock changes
 */
async function updateProduct(id, data) {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new Error("Product not found.");
  }

  const updatedData = { ...data };

  // Parse numeric values
  if (data.pricePerDay !== undefined) updatedData.pricePerDay = Number(data.pricePerDay);
  if (data.pricePerHour !== undefined) updatedData.pricePerHour = Number(data.pricePerHour);
  if (data.pricePerWeek !== undefined) updatedData.pricePerWeek = Number(data.pricePerWeek);
  if (data.securityDeposit !== undefined) updatedData.securityDeposit = Number(data.securityDeposit);
  if (data.paddingHours !== undefined) updatedData.paddingHours = Number(data.paddingHours);
  if (data.lateFeePerHour !== undefined) updatedData.lateFeePerHour = Number(data.lateFeePerHour);
  if (data.gracePeriodHours !== undefined) updatedData.gracePeriodHours = Number(data.gracePeriodHours);
  if (data.maxLateFee !== undefined) updatedData.maxLateFee = Number(data.maxLateFee);

  if (data.variants !== undefined) {
    updatedData.variants = typeof data.variants === "string" ? data.variants : JSON.stringify(data.variants);
  }

  if (data.inStock !== undefined) {
    const newStock = Number(data.inStock);
    if (newStock < 0) {
      throw new Error("Stock count cannot be negative.");
    }
    updatedData.inStock = newStock;

    // Adjust inventory serial slots
    const currentStock = existingProduct.inStock;
    if (newStock > currentStock) {
      // Add new inventory items
      const serialsToAdd = [];
      for (let i = currentStock + 1; i <= newStock; i++) {
        serialsToAdd.push({
          productId: id,
          serialNumber: `${id.slice(0, 8).toUpperCase()}-SN-${String(i).padStart(3, "0")}-${Date.now()}`,
          status: "available",
        });
      }
      await prisma.inventory.createMany({ data: serialsToAdd });
    } else if (newStock < currentStock) {
      // Remove excess inventory items (prefer "available" items first, ensuring we don't delete rented/in-use items)
      const availableItems = await prisma.inventory.findMany({
        where: { productId: id, status: "available" },
        take: currentStock - newStock,
      });

      if (availableItems.length > 0) {
        await prisma.inventory.deleteMany({
          where: {
            id: { in: availableItems.map((item) => item.id) },
          },
        });
      }
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: updatedData,
  });

  return {
    ...updatedProduct,
    variants: updatedProduct.variants ? JSON.parse(updatedProduct.variants) : {},
  };
}

/**
 * Admin: Delete a product (cascades deletion of inventories/orders under Prisma schema constraints)
 */
async function deleteProduct(id) {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new Error("Product not found.");
  }

  // Delete product (Prisma schema will cascade-delete dependencies if mapped, or throw constraint error)
  await prisma.product.delete({
    where: { id },
  });

  return { success: true, id };
}

/**
 * Admin: Get all inventory items or filter by product
 */
async function getInventory(productId = null) {
  const where = productId ? { productId } : {};
  return prisma.inventory.findMany({
    where,
    include: {
      product: {
        select: { name: true, category: true },
      },
    },
  });
}

/**
 * Admin: Update status of individual inventory slot (e.g. mark as "damaged", "maintenance")
 */
async function updateInventoryItem(inventoryId, data) {
  const { status, notes, serialNumber } = data;

  const existingItem = await prisma.inventory.findUnique({
    where: { id: inventoryId },
  });

  if (!existingItem) {
    throw new Error("Inventory item not found.");
  }

  const updatedItem = await prisma.inventory.update({
    where: { id: inventoryId },
    data: {
      status: status || existingItem.status,
      notes: notes !== undefined ? notes : existingItem.notes,
      serialNumber: serialNumber || existingItem.serialNumber,
    },
  });

  return updatedItem;
}

/**
 * Check product availability for a specific date range
 * Checks the overlap of active orders against the product's total inventory count
 */
async function checkProductAvailability(productId, pickupDate, returnDate) {
  if (!pickupDate || !returnDate) {
    throw new Error("Pickup date and return date are required to check availability.");
  }

  const start = new Date(pickupDate);
  const end = new Date(returnDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid pickup date or return date format.");
  }

  if (start >= end) {
    throw new Error("Pickup date must be before return date.");
  }

  // Count total inventory for the product
  const totalStock = await prisma.inventory.count({
    where: { productId, status: { not: "lost" } }, // ignore lost items
  });

  // Find overlapping orders for this product
  // Overlapping if (Order.pickupDate <= Request.returnDate) AND (Order.returnDate >= Request.pickupDate)
  // Exclude order statuses that represent non-active/returned states: returned, late_return, cancelled
  const overlappingItems = await prisma.orderItem.findMany({
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

  const bookedQty = overlappingItems.reduce((acc, item) => acc + item.qty, 0);
  const availableQty = Math.max(0, totalStock - bookedQty);

  return {
    productId,
    totalStock,
    bookedQty,
    availableQty,
    isAvailable: availableQty > 0,
  };
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getInventory,
  updateInventoryItem,
  checkProductAvailability,
};
