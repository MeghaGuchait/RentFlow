/**
 * Core rental business logic: late fee + security deposit settlement.
 * Mirrors the spec: "if the rented product is late by X hours, apply
 * lateFeeRate * hoursLate, deducted from the security deposit; refund the rest."
 */

export const PERIODICITY_TO_MS = {
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
  week: 1000 * 60 * 60 * 24 * 7,
  month: 1000 * 60 * 60 * 24 * 30,
};

/**
 * @param {Date|string} dueDate     scheduled return date/time
 * @param {Date|string} actualDate  actual return date/time
 * @param {number} gracePeriodHours grace window before late fees start
 * @param {number} lateFeePerHour   currency amount charged per late hour
 * @param {number} depositAmount   security deposit held for the order
 * @param {number} maxLateFee      optional cap on the total late fee
 * @param {number} damageFee       additional fee for product damage
 * @param {number} missingAccFee   additional fee for missing accessories
 */
export function calculateSettlement({
  dueDate,
  actualDate,
  gracePeriodHours = 0,
  lateFeePerHour = 0,
  depositAmount = 0,
  maxLateFee = Infinity,
  damageFee = 0,
  missingAccFee = 0
}) {
  const due = new Date(dueDate).getTime();
  const actual = new Date(actualDate).getTime();
  const graceMs = gracePeriodHours * 60 * 60 * 1000;

  const diffMs = actual - due - graceMs;
  const isLate = diffMs > 0;
  const hoursLate = isLate ? Math.ceil(diffMs / (1000 * 60 * 60)) : 0;

  let lateFee = isLate ? hoursLate * lateFeePerHour : 0;
  lateFee = Math.min(lateFee, maxLateFee);

  const totalDeductions = Math.min(lateFee + damageFee + missingAccFee, depositAmount);
  const refund = Math.max(depositAmount - totalDeductions, 0);

  return {
    isLate,
    hoursLate,
    lateFee: round2(lateFee),
    refund: round2(refund),
    depositAmount: round2(depositAmount),
    damageFee: round2(damageFee),
    missingAccFee: round2(missingAccFee),
    totalDeductions: round2(totalDeductions),
  };
}

export function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

export function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
