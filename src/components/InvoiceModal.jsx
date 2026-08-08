import React from "react";
import { Printer, Download, CheckCircle, FileText } from "lucide-react";
import Modal from "./ui/Modal.jsx";
import Button from "./ui/Button.jsx";
import { formatCurrency, formatDate } from "../utils/lateFee.js";
import { useStore } from "../context/StoreContext.jsx";
export default function InvoiceModal({ open, onClose, order }) {
  const { products, settings } = useStore();
  if (!order) return null;
  const product = products.find((p) => p.id === order.productId);
  const untaxed = order.total;
  const tax = +(untaxed * 0.1).toFixed(2);
  const grandTotal = untaxed + tax;
  const handlePrint = () => {
    window.print();
  };                             
  return (
    <Modal open={open} onClose={onClose} title={`Official Rental Invoice - ${order.id}`}>
      <div className="space-y-6 print:p-0">
        {/* Invoice Header */}
        <div className="border-b border-brand-text/10 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-brand-accent">RentFlow Enterprise</h2>
            <p className="text-xs text-brand-text/60">{settings.companyHeader}</p>
            <p className="text-xs text-brand-text/50">GSTIN: 27AAACR1234F1Z9 · Tax Reg: TAX-99482</p>
          </div>
          <div className="text-right">
            <span className="inline-block rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              INVOICE {order.id.replace("SO", "INV/2026/")}
            </span>
            <p className="text-xs text-brand-text/50 mt-1">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>     {/* Customer & Billing Info */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="rounded-lg bg-brand-text/[0.02] p-3 border border-brand-text/5">
            <p className="font-semibold text-brand-text uppercase tracking-wider mb-1">Customer / Billed To</p>
            <p className="font-medium text-brand-text">{order.customer}</p>
            <p className="text-brand-text/60">221B Baker Street, Suite 4B</p>
            <p className="text-brand-text/60">Contact: client@example.com</p>
          </div>
          <div className="rounded-lg bg-brand-text/[0.02] p-3 border border-brand-text/5">
            <p className="font-semibold text-brand-text uppercase tracking-wider mb-1">Rental Period</p>
            <p className="text-brand-text/80 font-mono">Start: {formatDate(order.pickupDate)}</p>
            <p className="text-brand-text/80 font-mono">Return: {formatDate(order.returnDate)}</p>
            <p className="text-brand-text/60 mt-1">Delivery Method: {order.deliveryMethod || "Store Pickup"}</p>
          </div>
        </div>     {/* Line Items Table */}
        <div className="overflow-hidden rounded-xl border border-brand-text/10">
          <table className="w-full text-xs text-left">
            <thead className="bg-brand-text/5 text-brand-text/60 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-3 py-2.5">Item Description</th>
                <th className="px-3 py-2.5 text-center">Qty</th>
                <th className="px-3 py-2.5 text-right">Unit Price</th>
                <th className="px-3 py-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-text/5">
              <tr>
                <td className="px-3 py-3">
                  <p className="font-semibold text-brand-text">{product?.name || "Rental Item"}</p>
                  <p className="text-[11px] text-brand-text/50">Category: {product?.category || "Standard"}</p>
                </td>
                <td className="px-3 py-3 text-center font-medium">{order.qty}</td>
                <td className="px-3 py-3 text-right">{formatCurrency(order.total / (order.qty || 1))}</td>
                <td className="px-3 py-3 text-right font-medium">{formatCurrency(order.total)}</td>
              </tr>
              {order.depositHeld > 0 && (
                <tr className="bg-amber-50/50">
                  <td className="px-3 py-2 text-amber-900 font-medium">Security Deposit (Refundable)</td>
                  <td className="px-3 py-2 text-center">1</td>
                  <td className="px-3 py-2 text-right">{formatCurrency(order.depositHeld)}</td>
                  <td className="px-3 py-2 text-right font-medium">{formatCurrency(order.depositHeld)}</td>
                </tr>
              )}     </tbody>
          </table>
        </div>
        {/* Totals Summary */}
        <div className="ml-auto w-64 space-y-1.5 text-xs text-right">
          <div className="flex justify-between text-brand-text/60"><span>Untaxed Amount:</span><span>{formatCurrency(untaxed)}</span></div>
          <div className="flex justify-between text-brand-text/60"><span>Taxes (10%):</span><span>{formatCurrency(tax)}</span></div>
          <div className="flex justify-between text-sm font-bold text-brand-accent pt-1 border-t border-brand-text/10">
            <span>Grand Total:</span><span>{formatCurrency(grandTotal + (order.depositHeld || 0))}</span>
          </div>
        </div>      {/* Invoice Footer */}
        <div className="border-t border-brand-text/10 pt-3 text-center text-[11px] text-brand-text/50">
          <p>{settings.companyFooter}</p>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4" /> Print Invoice
          </Button>
          <Button size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}