import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Printer, Send, FileCheck2, PackageCheck, RotateCcw } from "lucide-react";
import AdminLayout from "../../components/AdminLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { useStore } from "../../context/StoreContext.jsx";
import { formatCurrency, formatDate } from "../../utils/lateFee.js";

export default function OrderDetail() {
  const { id } = useParams();
  const { orders, products, updateOrderStatus, processReturn } = useStore();
  const order = orders.find((o) => o.id === id);
  const product = products.find((p) => p.id === order?.productId);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [actualReturn, setActualReturn] = useState("");
  const [settlement, setSettlement] = useState(null);

  if (!order) {
    return (
      <AdminLayout title="Order not found">
        <Link to="/admin/orders" className="text-brand-accent hover:underline">← Back to orders</Link>
      </AdminLayout>
    );
  }

  const untaxed = order.total;
  const tax = +(untaxed * 0.1).toFixed(2);
  const grandTotal = untaxed + tax;

  const handleConfirmReturn = () => {
    const result = processReturn(order.id, actualReturn || new Date().toISOString());
    setSettlement(result);
  };

  return (
    <AdminLayout title={`Rental Order ${order.id}`}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline"><Printer size={14} /> Print</Button>
        {order.status === "quotation" && (
          <Button size="sm" onClick={() => updateOrderStatus(order.id, "quotation_sent")}>
            <Send size={14} /> Send Quotation
          </Button>
        )}
        {(order.status === "quotation" || order.status === "quotation_sent") && (
          <Button size="sm" variant="subtle" onClick={() => updateOrderStatus(order.id, "reserved")}>
            <FileCheck2 size={14} /> Confirm → Sale Order
          </Button>
        )}
        {order.status === "reserved" && (
          <Button size="sm" onClick={() => updateOrderStatus(order.id, "picked_up")}>
            <PackageCheck size={14} /> Confirm Pickup
          </Button>
        )}
        {(order.status === "picked_up" || order.status === "late_pickup") && (
          <Button size="sm" onClick={() => setShowReturnModal(true)}>
            <RotateCcw size={14} /> Process Return
          </Button>
        )}
        {!["cancelled", "returned", "late_return"].includes(order.status) && (
          <Button size="sm" variant="ghost" onClick={() => updateOrderStatus(order.id, "cancelled")}>
            Cancel
          </Button>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-brand-text">{order.id}</h2>
              <p className="text-sm text-brand-text/50">{order.customer}</p>
            </div>
            <Badge status={order.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-brand-text/8 pt-4 text-sm">
            <div>
              <p className="text-xs text-brand-text/40">Invoice Address</p>
              <p className="text-brand-text/70">{order.customer}, 221B Baker Street</p>
            </div>
            <div>
              <p className="text-xs text-brand-text/40">Delivery Address</p>
              <p className="text-brand-text/70">Same as invoice address</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-text/45">Order Line</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-text/8 text-left text-xs text-brand-text/40">
                  <th className="py-2">Product</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Rental Period</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-brand-text/5">
                  <td className="py-3">{product?.name}</td>
                  <td className="py-3">{order.qty}</td>
                  <td className="py-3 text-brand-text/60">
                    {formatDate(order.pickupDate)} → {formatDate(order.returnDate)}
                  </td>
                  <td className="py-3 text-right">{formatCurrency(order.total)}</td>
                </tr>
                {order.settlement?.lateFee > 0 && (
                  <tr>
                    <td className="py-3 text-red-500">Late Fees</td>
                    <td className="py-3">1</td>
                    <td className="py-3 text-brand-text/60">{order.settlement.hoursLate} hrs late</td>
                    <td className="py-3 text-right text-red-500">{formatCurrency(order.settlement.lateFee)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 ml-auto max-w-xs space-y-1.5 border-t border-brand-text/8 pt-4 text-sm">
            <div className="flex justify-between text-brand-text/60"><span>Untaxed Amount</span><span>{formatCurrency(untaxed)}</span></div>
            <div className="flex justify-between text-brand-text/60"><span>Taxes (10%)</span><span>{formatCurrency(tax)}</span></div>
            <div className="flex justify-between font-semibold text-brand-text"><span>Total</span><span>{formatCurrency(grandTotal)}</span></div>
          </div>
        </Card>

        <Card className="h-fit p-6">
          <h3 className="mb-4 text-sm font-semibold text-brand-text">Deposit &amp; Settlement</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-brand-text/60"><span>Deposit Held</span><span>{formatCurrency(order.depositHeld)}</span></div>
            {order.settlement ? (
              <>
                <div className="flex justify-between text-red-500"><span>Late Fee Deducted</span><span>-{formatCurrency(order.settlement.lateFee)}</span></div>
                <div className="flex justify-between border-t border-brand-text/8 pt-2 font-semibold text-brand-text">
                  <span>Refunded</span><span>{formatCurrency(order.settlement.refund)}</span>
                </div>
              </>
            ) : (
              <p className="pt-2 text-xs text-brand-text/40">Deposit will be settled automatically on return.</p>
            )}
          </div>
        </Card>
      </div>

      <Modal open={showReturnModal} onClose={() => setShowReturnModal(false)} title="Process Return">
        {settlement ? (
          <div className="space-y-3 text-sm">
            <p className={settlement.isLate ? "text-red-500" : "text-emerald-600"}>
              {settlement.isLate ? `Returned ${settlement.hoursLate}h late.` : "Returned on time — full deposit refunded."}
            </p>
            <div className="rounded-lg bg-brand-accentSoft p-4">
              <div className="flex justify-between"><span>Deposit</span><span>{formatCurrency(settlement.depositAmount)}</span></div>
              <div className="flex justify-between text-red-500"><span>Late Fee</span><span>-{formatCurrency(settlement.lateFee)}</span></div>
              <div className="flex justify-between font-semibold"><span>Refund to Customer</span><span>{formatCurrency(settlement.refund)}</span></div>
            </div>
            <Button className="w-full" onClick={() => setShowReturnModal(false)}>Done</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-brand-text/60">
              Scheduled return: <strong>{formatDate(order.returnDate)}</strong>
            </p>
            <label className="block text-sm font-medium text-brand-text/70">
              Actual return date/time
              <input
                type="datetime-local"
                className="mt-1.5 w-full rounded-lg border border-brand-text/15 px-3 py-2 text-sm"
                value={actualReturn}
                onChange={(e) => setActualReturn(e.target.value)}
              />
            </label>
            <Button className="w-full" onClick={handleConfirmReturn}>Confirm Return &amp; Settle Deposit</Button>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
