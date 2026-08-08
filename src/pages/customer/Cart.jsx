import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Heart, Store, Truck, Tag, ShieldCheck } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { formatCurrency } from "../../utils/lateFee.js";
export default function Cart() {
  const { items, removeItem, updateQty, subtotal, depositTotal } = useCart()
    const [deliveryMethod, setDeliveryMethod] = useState("delivery"); // 'delivery' or 'pickup'
  const [coupon, setCoupon] = useState("WELCOME10");
  const [appliedDiscount, setAppliedDiscount] = useState(10); // 10% default welcome discount
  const [couponMsg, setCouponMsg] = useState("Code WELCOME10 applied! (10% OFF)");
  const navigate = useNavigate();
    const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (["WELCOME10", "XXXX10", "NEW10", "RENT10"].includes(code)) {
      setAppliedDiscount(10);
      setCouponMsg(`Coupon ${code} applied successfully (10% OFF)`);
    } else if (code) {
      setAppliedDiscount(0);
      setCouponMsg("Invalid coupon code.");
    }
  };
  const deliveryCharge = deliveryMethod === "delivery" ? (items.length ? 15 : 0) : 0;
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const finalRentalCost = Math.max(subtotal - discountAmount, 0);
  const total = finalRentalCost + deliveryCharge + depositTotal;
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
                <h1 className="text-2xl font-semibold text-brand-text">Order Summary &amp; Rental Cart</h1>
        {items.length === 0 ? (
          <div className="mt-16 text-center">
                        <p className="text-brand-text/50">Your rental cart is empty.</p>
            <Button as={Link} to="/shop" className="mt-4">
                 Explore Products to Rent
            </Button>
          </div>
        ) : (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
              <div className="space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.lineId || item.product.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-3xl border border-brand-text/10 bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-3">
                          <p className="font-medium text-brand-text">{item.product.name}</p>
                          <p className="text-xs text-brand-text/50 font-mono">
                            Period: {item.startDate || "Today"} → {item.endDate || "3 Days"}
                          </p>
                          {Object.keys(item.variant || {}).length > 0 && (
                            <p className="mt-1 text-xs text-brand-text/40">
                              Variant: {Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-amber-700 font-medium flex items-center gap-1">
                            <ShieldCheck size={12} /> Deposit: {formatCurrency((item.product.securityDeposit || 50) * item.qty)} (Refundable)
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQty(item.lineId, item.qty - 1)}
                              className="rounded-lg border border-brand-text/15 px-2.5 py-1 text-sm font-semibold"
                            >
                              -
                            </button>
                            <span className="w-9 text-center text-sm font-medium">{item.qty}</span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.lineId, item.qty + 1)}
                              className="rounded-lg border border-brand-text/15 px-2.5 py-1 text-sm font-semibold"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(item.lineId)}
                              className="inline-flex items-center gap-1 rounded-lg border border-brand-text/15 px-3 py-1 text-xs font-semibold text-brand-text/50 hover:text-brand-accent"
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </div>
                        <p className="font-semibold text-brand-accent">{formatCurrency((item.product.pricePerDay || 20) * item.qty)}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <Card className="h-fit p-6 space-y-4">
                <h3 className="font-semibold text-brand-text text-base">Fulfillment &amp; Pricing</h3>
                {/* Delivery Method Selection */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-text/50">Fulfillment Method</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                    <button
                      onClick={() => setDeliveryMethod("delivery")}
                      className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                        deliveryMethod === "delivery" ? "border-brand-accent bg-brand-accentSoft text-brand-accentDark font-semibold" : "border-brand-text/15 text-brand-text/60"
                      }`}
                    >
                      <Truck size={14} /> Standard Delivery ($15)
                    </button>
                    <button
                      onClick={() => setDeliveryMethod("pickup")}
                      className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                        deliveryMethod === "pickup" ? "border-brand-accent bg-brand-accentSoft text-brand-accentDark font-semibold" : "border-brand-text/15 text-brand-text/60"
                      }`}
                    >
                      <Store size={14} /> Pick up from Store (FREE)
                    </button>
                  </div>
                </div>
                {/* Coupon Code */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-text/50 flex items-center gap-1">
                    <Tag size={12} /> Apply Coupon
                  </p>
                  <div className="flex gap-2">
                    <input
                      placeholder="e.g. WELCOME10"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 rounded-lg border border-brand-text/15 px-3 py-1.5 text-xs focus:border-brand-accent focus:outline-none"
                    />
                    <Button variant="outline" size="sm" onClick={handleApplyCoupon}>Apply</Button>
                  </div>
                  {couponMsg && <p className="text-[11px] text-emerald-600 font-medium">{couponMsg}</p>}
                </div>
                {/* Price Breakdown */}
                <div className="space-y-2 border-t border-brand-text/8 pt-3 text-sm">
                  <div className="flex justify-between text-brand-text/60">
                    <span>Rental Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount ({appliedDiscount}%)</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-brand-text/60">
                    <span>Delivery Charges</span>
                    <span>{deliveryCharge === 0 ? "FREE" : formatCurrency(deliveryCharge)}</span>
                  </div>
                  <div className="flex justify-between text-amber-700 font-medium">
                    <span>Security Deposit (Refundable)</span>
                    <span>{formatCurrency(depositTotal)}</span>
                  </div>
                  <div className="flex justify-between border-t border-brand-text/8 pt-2 text-base font-bold text-brand-text">
                    <span>Total Amount</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                <Button
                  onClick={() =>
                    navigate("/checkout", {
                      state: { deliveryMethod, appliedDiscount, discountAmount },
                    })
                  }
                  className="w-full"
                >
                  Proceed to Checkout →
                </Button>
              </Card>
            </div>
        )}
      </div>
    </div>
  );
}


