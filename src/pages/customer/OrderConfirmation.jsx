import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Printer, ArrowRight, ShieldCheck } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import InvoiceModal from "../../components/InvoiceModal.jsx";
import { useStore } from "../../context/StoreContext.jsx";
export default function OrderConfirmation() {
   const location = useLocation();
  const { orders } = useStore();
  const orderId = location.state?.orderId || "SO0010";
  const order = orders.find((o) => o.id === orderId) || orders[0];
  const [showInvoice, setShowInvoice] = useState(false);
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-xl px-6 py-12 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <CheckCircle2 className="mx-auto text-brand-accent" size={64} />
        </motion.div>
        <h1 className="mt-4 text-2xl font-bold text-brand-text">Thank you for your order!</h1>
        <p className="mt-1 text-sm text-brand-text/55">
          Rental Order <strong>{order?.id || orderId}</strong> has been successfully placed &amp; confirmed.
        </p>
        <Card className="mt-6 p-6 text-left space-y-4">
          <div className="flex items-center justify-between border-b border-brand-text/8 pb-3">
            <div>
              <p className="text-sm font-bold text-brand-text">Invoice {order?.id?.replace("SO", "INV/2026/")}</p>
              <p className="text-xs text-brand-text/50">Status: Confirmed &amp; Reserved</p>
            </div>
            <button
              onClick={() => setShowInvoice(true)}
              className="flex items-center gap-1.5 rounded-lg border border-brand-accent/20 bg-brand-accentSoft px-3 py-1.5 text-xs font-semibold text-brand-accentDark hover:bg-brand-accent/15"
            >
              <Printer size={14} /> View / Print Invoice
            </button>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck size={15} /> Security Deposit Held: ${order?.depositHeld || 150}
            </div>
            <p className="text-emerald-800/80">
              Your security deposit is locked in escrow and will be automatically refunded upon timely return to our store/pickup agent.
            </p>
          </div>
          <p className="text-xs text-brand-text/50">
            A digital copy of this invoice has been sent to your email and is permanently saved in your customer portal.
          </p>
          <Button onClick={() => setShowInvoice(true)} variant="subtle" className="w-full">
            <Download size={15} /> Print / Download Official PDF Invoice
          </Button>
        </Card>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button as={Link} to="/my-orders" variant="outline">
            View My Orders
          </Button>
          <Button as={Link} to="/shop">
            Continue Shopping <ArrowRight size={14} />
          </Button>
        </div>
      </div>
      <InvoiceModal open={showInvoice} onClose={() => setShowInvoice(false)} order={order} />
    </div>
  );
}

