import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Printer } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";

export default function OrderConfirmation() {
  const orderId = "SO00010"; // in a real app, pass this via route state/params

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.5 }}>
          <CheckCircle2 className="mx-auto text-brand-accent" size={56} />
        </motion.div>
        <h1 className="mt-5 text-2xl font-semibold text-brand-text">Thank you for your order!</h1>
        <p className="mt-2 text-brand-text/55">Order {orderId} · Your payment has been processed.</p>

        <Card className="mt-8 p-6 text-left">
          <div className="flex items-center justify-between border-b border-brand-text/8 pb-3">
            <p className="text-sm font-semibold text-brand-text">Order {orderId}</p>
            <button className="flex items-center gap-1 text-xs text-brand-text/50 hover:text-brand-accent">
              <Printer size={13} /> Print
            </button>
          </div>
          <p className="mt-3 text-xs text-brand-text/45">
            A copy of your invoice has also been emailed to you and is available anytime under My Orders.
          </p>
          <Button variant="subtle" className="mt-4 w-full">
            <Download size={15} /> Download Invoice
          </Button>
        </Card>

        <div className="mt-8 flex justify-center gap-3">
          <Button as={Link} to="/my-orders" variant="outline">
            View My Orders
          </Button>
          <Button as={Link} to="/shop">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
