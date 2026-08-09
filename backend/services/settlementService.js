/**
 * services/settlementService.js
 * Server-side rental settlement and late fee calculation business logic.
 * Serves as the trusted single source of truth for financial computations.
 */

const prisma = require("../config/database");

/**
 * Pure function mirroring the front-end calculation rule.
 * Deducts late fee + damage fee + missing items fee from security deposit and returns details.
 */
function calculateSettlementAmount({
  dueDate,
  actualDate,
  gracePeriodHours = 0,
  lateFeePerHour = 0,
  depositAmount = 0,
  maxLateFee = Infinity,
  damageFee = 0,
  missingAccFee = 0,
}) {
  const due = new Date(dueDate).getTime();
  const actual = new Date(actualDate).getTime();
  const graceMs = gracePeriodHours * 60 * 60 * 1000;

  const diffMs = actual - due - graceMs;
  const isLate = diffMs > 0;
  const hoursLate = isLate ? Math.ceil(diffMs / (1000 * 60 * 60)) : 0;

  let lateFee = isLate ? hoursLate * lateFeePerHour : 0;
  lateFee = Math.min(lateFee, maxLateFee);

  // Total deductions capped at depositAmount
  const totalDeductions = Math.min(lateFee + damageFee + missingAccFee, depositAmount);
  const refund = Math.max(depositAmount - totalDeductions, 0);

  return {
    isLate,
    hoursLate,
    lateFee: Number(lateFee.toFixed(2)),
    refund: Number(refund.toFixed(2)),
    depositAmount: Number(depositAmount.toFixed(2)),
    damageFee: Number(damageFee.toFixed(2)),
    missingAccFee: Number(missingAccFee.toFixed(2)),
    totalDeductions: Number(totalDeductions.toFixed(2)),
  };
}

/**
 * Record return and process settlement in a database transaction
 */
async function processReturnAndSettlement(orderId, returnData) {
  const {
    actualReturnDate = new Date().toISOString(),
    condition = "good",
    damageFee = 0,
    missingAccFee = 0,
    notes = "",
  } = returnData;

  const sanitizedDamageFee = Math.max(0, Number(damageFee) || 0);
  const sanitizedMissingFee = Math.max(0, Number(missingAccFee) || 0);
  const returnTimestamp = new Date(actualReturnDate);

  if (isNaN(returnTimestamp.getTime())) {
    throw new Error("Invalid return date format.");
  }

  return prisma.$transaction(async (tx) => {
    // 1. Fetch Order and items
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      throw new Error(`Order not found with ID: ${orderId}`);
    }

    if (order.status === "returned" || order.status === "late_return") {
      throw new Error("Order has already been returned and settled.");
    }

    // 2. Fetch global settings fallback
    const settings = await tx.systemSettings.findUnique({
      where: { id: 1 },
    });

    const globalLateFee = settings?.globalLateFeePerHour ?? 10.0;
    const globalGrace = settings?.globalGracePeriodHours ?? 1.0;
    const globalMaxLimit = settings?.maxLateFeeLimit ?? 200.0;

    // 3. Compute late fee parameters (supporting multiple order items if present)
    // For simplicity, we use the pricing rules of the first item
    const firstItem = order.orderItems[0];
    const product = firstItem?.product;

    const lateFeePerHour = product?.lateFeePerHour ?? globalLateFee;
    const gracePeriodHours = product?.gracePeriodHours ?? globalGrace;
    const maxLateFee = product?.maxLateFee ?? globalMaxLimit;

    // 4. Calculate settlement details server-side
    const calculation = calculateSettlementAmount({
      dueDate: order.returnDate,
      actualDate: returnTimestamp,
      gracePeriodHours,
      lateFeePerHour,
      depositAmount: order.depositHeld,
      maxLateFee,
      damageFee: sanitizedDamageFee,
      missingAccFee: sanitizedMissingFee,
    });

    // 5. Create Return record
    const returnRecord = await tx.return.create({
      data: {
        orderId,
        actualReturnDate: returnTimestamp,
        condition,
        notes,
      },
    });

    // 6. Create Settlement record
    const settlementRecord = await tx.settlement.create({
      data: {
        orderId,
        isLate: calculation.isLate,
        hoursLate: calculation.hoursLate,
        lateFee: calculation.lateFee,
        damageFee: calculation.damageFee,
        missingAccFee: calculation.missingAccFee,
        totalDeductions: calculation.totalDeductions,
        refund: calculation.refund,
        status: "settled",
      },
    });

    // 7. Update Order status
    // Flows: late_return (if late, damaged or missing accessory), returned (if on-time & clean)
    const isLateOrDamaged = calculation.isLate || sanitizedDamageFee > 0 || sanitizedMissingFee > 0;
    const newStatus = isLateOrDamaged ? "late_return" : "returned";

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        invoiceStatus: "invoiced",
      },
    });

    // 8. Release the inventory slots (set status back to "available")
    const inventoryIds = order.orderItems
      .map((item) => item.inventoryId)
      .filter((id) => id !== null);

    if (inventoryIds.length > 0) {
      await tx.inventory.updateMany({
        where: { id: { in: inventoryIds } },
        data: { status: "available" },
      });
    }

    return {
      order: updatedOrder,
      return: returnRecord,
      settlement: settlementRecord,
    };
  });
}

/**
 * Fetch settlement details for a specific order
 */
async function getSettlementDetails(orderId, userId, userRole) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      settlement: true,
      returnDetails: true,
    },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  // Authorization verification
  if (userRole === "customer" && order.userId !== userId) {
    throw new Error("Unauthorized access to settlement information.");
  }

  return {
    orderId: order.id,
    status: order.status,
    depositHeld: order.depositHeld,
    actualReturnDate: order.returnDetails ? order.returnDetails.actualReturnDate : null,
    productCondition: order.returnDetails ? order.returnDetails.condition : null,
    inspectionNotes: order.returnDetails ? order.returnDetails.notes : null,
    settlement: order.settlement,
    returnDetails: order.returnDetails,
  };
}

module.exports = {
  calculateSettlementAmount,
  processReturnAndSettlement,
  getSettlementDetails,
};
