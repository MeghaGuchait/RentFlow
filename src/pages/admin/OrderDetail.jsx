import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Printer,
  Send,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";
import InvoiceModal from "../../components/InvoiceModal.jsx";
import { useStore } from "../../context/StoreContext.jsx";
import { formatCurrency, formatDate } from "../../utils/lateFee.js";

export default function OrderDetail() {
  const { id } = useParams();
  const { orders, products, updateOrderStatus, processReturn } = useStore();
  const order = orders.find((o) => o.id === id);

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [actualReturn, setActualReturn] = useState(new Date().toISOString().slice(0, 16));
  const [condition, setCondition] = useState("good");
  const [damageFee, setDamageFee] = useState(0);
  const [missingAccFee, setMissingAccFee] = useState(0);
  const [notes, setNotes] = useState("");
  const [settlement, setSettlement] = useState(null);

  if (!order) {
    return (
      <AdminLayout title="Order not found">
        <Link to="/admin/orders" className="text-brand-accent hover:underline font-medium">
          ← Back to all orders
        </Link>
      </AdminLayout>
    );
  }

  const product = products.find((p) => p.id === order.productId);
  const untaxed = order.total || 0;
  const tax = +(untaxed * 0.1).toFixed(2);
  const grandTotal = untaxed + tax;

  const handleConfirmReturn = () => {
    const result = processReturn(order.id, actualReturn || new Date().toISOString());
    if (result) {
      setSettlement(result);
    }
    setShowReturnModal(true);
  };

  return (
    <AdminLayout title={`Rental Order ${order.id}`}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setShowInvoiceModal(true)}>
          <Printer size={14} /> Print Invoice
        </Button>
        {order.status === "quotation" && (
          <Button size="sm" onClick={() => updateOrderStatus(order.id, "quotation_sent")}>
            <Send size={14} /> Send Quotation
          </Button>
        )}
        {(order.status === "picked_up" || order.status === "late_pickup") && (
          <Button size="sm" onClick={() => setShowReturnModal(true)}>
            <RotateCcw size={14} /> Process Return &amp; Inspect
          </Button>
        )}
        {!["cancelled", "returned", "late_return"].includes(order.status) && (
          <Button size="sm" variant="ghost" onClick={() => updateOrderStatus(order.id, "cancelled")}>
            Cancel Order
          </Button>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between border-b border-brand-text/8 pb-4">
            <div>
              <h2 className="text-xl font-bold text-brand-text flex items-center gap-2">
                {order.id}
                <span className="text-xs font-mono text-brand-text/45">
                  ({order.deliveryMethod || "Store Pickup"})
                </span>
              </h2>
              <p className="text-xs text-brand-text/50">
                Customer: <strong className="text-brand-text">{order.customer}</strong>
              </p>
            </div>
            <Badge status={order.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="rounded-lg bg-brand-text/[0.02] p-3 border border-brand-text/5">
              <p className="text-brand-text/40 font-semibold uppercase tracking-wider mb-1">Invoice Address</p>
              <p className="text-brand-text/80 font-medium">{order.customer}</p>
              <p className="text-brand-text/60">221B Baker Street, Suite 4B</p>
            </div>
            <div className="rounded-lg bg-brand-text/[0.02] p-3 border border-brand-text/5">
              <p className="text-brand-text/40 font-semibold uppercase tracking-wider mb-1">Fulfillment Info</p>
              <p className="text-brand-text/80 font-medium">{order.deliveryMethod || "Store Pickup"}</p>
              <p className="text-brand-text/60">Pickup: {formatDate(order.pickupDate)}</p>
              <p className="text-brand-text/60">Return Due: {formatDate(order.returnDate)}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-text/45">Order Lines</p>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-brand-text/8 text-left text-brand-text/40 font-semibold uppercase">
                  <th className="py-2.5">Product</th>
                  <th className="py-2.5">Qty</th>
                  <th className="py-2.5">Rental Period</th>
                  <th className="py-2.5 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-text/5">
                <tr>
                  <td className="py-3">
                    <p className="font-semibold text-brand-text">{product?.name || "Rental Product"}</p>
                    <p className="text-[11px] text-brand-text/45">Category: {product?.category || "Standard"}</p>
                  </td>
                  <td className="py-3 font-medium">{order.qty}</td>
                  <td className="py-3 text-brand-text/60 font-mono">
                    {formatDate(order.pickupDate)} → {formatDate(order.returnDate)}
                  </td>
                  <td className="py-3 text-right font-medium">{formatCurrency(order.total)}</td>
                </tr>
                {order.settlement?.lateFee > 0 && (
                  <tr className="bg-red-50/50">
                    <td className="py-2.5 font-medium text-red-600">Late Fee Charge ({order.settlement.hoursLate} hrs)</td>
                    <td className="py-2.5">1</td>
                    <td className="py-2.5 text-red-600/80 font-mono">Overdue Return</td>
                    <td className="py-2.5 text-right font-semibold text-red-600">+{formatCurrency(order.settlement.lateFee)}</td>
                  </tr>
                )}
                {order.settlement?.damageFee > 0 && (
                  <tr className="bg-amber-50/50">
                    <td className="py-2.5 font-medium text-amber-800">Damage Deduction</td>
                    <td className="py-2.5">1</td>
                    <td className="py-2.5 text-amber-800/80 font-mono">Condition Inspection</td>
                    <td className="py-2.5 text-right font-semibold text-amber-800">+{formatCurrency(order.settlement.damageFee)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 ml-auto max-w-xs space-y-1.5 border-t border-brand-text/8 pt-4 text-xs">
            <div className="flex justify-between text-brand-text/60">
              <span>Untaxed Rental Subtotal</span>
              <span>{formatCurrency(untaxed)}</span>
            </div>
            <div className="flex justify-between text-brand-text/60">
              <span>Taxes (10%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between font-semibold text-brand-text">
              <span>Total</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-brand-accent pt-1 border-t border-brand-text/8">
              <span>Grand Total</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </Card>

        <Card className="h-fit p-6 space-y-4">
          <h3 className="text-sm font-bold text-brand-text flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-brand-accent" /> Security Deposit &amp; Settlement
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-brand-text/70">
              <span>Deposit Collected:</span>
              <span className="font-semibold text-brand-text">{formatCurrency(order.depositHeld)}</span>
            </div>
            {order.settlement ? (
              <div className="rounded-xl bg-brand-accentSoft p-3.5 space-y-1.5 border border-brand-accent/20">
                <p className="font-semibold text-brand-text">Return Reconciliation Log:</p>
                {order.settlement.lateFee > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Late Fee Deducted</span>
                    <span>-{formatCurrency(order.settlement.lateFee)}</span>
                  </div>
                )}
                {order.settlement.damageFee > 0 && (
                  <div className="flex justify-between text-amber-800">
                    <span>Damage Charge Deducted</span>
                    <span>-{formatCurrency(order.settlement.damageFee)}</span>
                  </div>
                )}
                {order.settlement.missingAccFee > 0 && (
                  <div className="flex justify-between text-amber-800">
                    <span>Missing Accessories Charge</span>
                    <span>-{formatCurrency(order.settlement.missingAccFee)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-emerald-700 border-t border-brand-accent/20 pt-1.5">
                  <span>Refunded to Customer:</span>
                  <span>{formatCurrency(order.settlement.refund)}</span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-amber-50/70 p-3 border border-amber-200 text-amber-900 leading-tight">
                <p className="font-semibold">Deposit Status: Active / Held</p>
                <p className="text-[11px] text-amber-800/80 mt-0.5">
                  Deposit will automatically calculate late charges or condition damages when return is processed.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Modal open={showReturnModal} onClose={() => setShowReturnModal(false)} title="Process Return &amp; Product Inspection">
        {settlement ? (
          <div className="space-y-4 text-xs">
            <div
              className={`rounded-xl p-4 border ${
                settlement.totalDeductions > 0
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : "bg-emerald-50 border-emerald-200 text-emerald-900"
              }`}
            >
              <p className="font-bold text-sm">
                {settlement.totalDeductions > 0
                  ? "Return Processed with Deductions"
                  : "Return Verified — 100% Full Refund Approved!"}
              </p>
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between">
                  <span>Deposit Held</span>
                  <span>{formatCurrency(settlement.depositAmount)}</span>
                </div>
                {settlement.lateFee > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Late Return Charge ({settlement.hoursLate} hrs)</span>
                    <span>-{formatCurrency(settlement.lateFee)}</span>
                  </div>
                )}
                {settlement.damageFee > 0 && (
                  <div className="flex justify-between text-amber-800">
                    <span>Damage Inspection Penalty</span>
                    <span>-{formatCurrency(settlement.damageFee)}</span>
                  </div>
                )}
                {settlement.missingAccFee > 0 && (
                  <div className="flex justify-between text-amber-800">
                    <span>Missing Accessories Fee</span>
                    <span>-{formatCurrency(settlement.missingAccFee)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-brand-text/10 pt-2 font-bold text-sm text-emerald-700">
                  <span>Net Refund to Customer</span>
                  <span>{formatCurrency(settlement.refund)}</span>
                </div>
              </div>
            </div>
            <Button className="w-full" onClick={() => setShowReturnModal(false)}>
              Done &amp; Close Log
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="rounded-lg bg-brand-text/5 p-3 font-mono">
              <p>
                Order: <strong>{order.id}</strong> · Scheduled: {formatDate(order.returnDate)}
              </p>
            </div>
            <div>
              <label className="block font-semibold text-brand-text mb-1">Actual Return Date &amp; Time</label>
              <input
                type="datetime-local"
                className="w-full rounded-lg border border-brand-text/15 px-3 py-2 text-xs"
                value={actualReturn}
                onChange={(e) => setActualReturn(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold text-brand-text mb-1">Product Condition Inspection</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCondition("good");
                    setDamageFee(0);
                    setMissingAccFee(0);
                  }}
                  className={`p-2 rounded-lg border text-center font-medium ${
                    condition === "good"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                      : "border-brand-text/15 text-brand-text/60"
                  }`}
                >
                  ✓ Good Condition
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCondition("damaged");
                    setDamageFee(35);
                    setMissingAccFee(0);
                  }}
                  className={`p-2 rounded-lg border text-center font-medium ${
                    condition === "damaged"
                      ? "bg-amber-50 border-amber-300 text-amber-900 font-bold"
                      : "border-brand-text/15 text-brand-text/60"
                  }`}
                >
                  ⚠ Damaged
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCondition("missing");
                    setMissingAccFee(25);
                    setDamageFee(0);
                  }}
                  className={`p-2 rounded-lg border text-center font-medium ${
                    condition === "missing"
                      ? "bg-red-50 border-red-300 text-red-900 font-bold"
                      : "border-brand-text/15 text-brand-text/60"
                  }`}
                >
                  ✖ Missing Items
                </button>
              </div>
            </div>
            {condition !== "good" && (
              <div className="grid grid-cols-2 gap-3 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                <div>
                  <label className="block font-semibold text-amber-900 mb-1">Damage Fee ($)</label>
                  <input
                    type="number"
                    value={damageFee}
                    onChange={(e) => setDamageFee(e.target.value)}
                    className="w-full rounded-lg border border-amber-300 bg-white px-2.5 py-1.5 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-amber-900 mb-1">Missing Items Fee ($)</label>
                  <input
                    type="number"
                    value={missingAccFee}
                    onChange={(e) => setMissingAccFee(e.target.value)}
                    className="w-full rounded-lg border border-amber-300 bg-white px-2.5 py-1.5 text-xs font-mono"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block font-semibold text-brand-text mb-1">Inspector Notes</label>
              <textarea
                rows={2}
                placeholder="e.g. Scratches on lens cap, verified return checklist..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-brand-text/15 p-2 text-xs"
              />
            </div>
            <Button className="w-full" onClick={handleConfirmReturn}>
              Confirm Return &amp; Settle Security Deposit
            </Button>
          </div>
        )}
      </Modal>

      <InvoiceModal open={showInvoiceModal} onClose={() => setShowInvoiceModal(false)} order={order} />
    </AdminLayout>
  );
}
