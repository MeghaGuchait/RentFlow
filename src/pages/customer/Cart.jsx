import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Heart } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import { useCart } from "../../context/CartContext.jsx";

export default function Cart() {
  const { items, removeItem, updateQty, subtotal, depositTotal } = useCart();
  const [coupon, setCoupon] = useState("");
  const navigate = useNavigate();
  const deliveryCharge = items.length ? 15 : 0;
  const total = subtotal + deliveryCharge + depositTotal;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-brand-text">Order Summary</h1>

        {items.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-brand-text/50">Your cart is empty.</p>
            <Button as={Link} to="/shop" className="mt-4">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.lineId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <Card className="flex gap-4 p-4">
                      <img src={item.product.image} alt="" className="h-24 w-24 rounded-xl object-cover" />
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-brand-text">{item.product.name}</p>
                            <p className="text-xs text-brand-text/45">
                              {item.startDate || "xx/xx/xxxx"} → {item.endDate || "xx/xx/xxxx"}
                            </p>
                            {Object.keys(item.variant).length > 0 && (
                              <p className="mt-1 text-xs text-brand-text/40">
                                {Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                              </p>
                            )}
                          </div>
                          <p className="font-semibold text-brand-accent">
                            ${(item.product.pricePerDay * item.qty).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-brand-text/15">
                            <button onClick={() => updateQty(item.lineId, item.qty - 1)} className="px-2.5 py-1 text-sm">-</button>
                            <span className="w-7 text-center text-sm">{item.qty}</span>
                            <button onClick={() => updateQty(item.lineId, item.qty + 1)} className="px-2.5 py-1 text-sm">+</button>
                          </div>
                          <div className="flex gap-3 text-xs text-brand-text/50">
                            <button className="flex items-center gap-1 hover:text-brand-accent">
                              <Heart size={13} /> Save for Later
                            </button>
                            <button
                              onClick={() => removeItem(item.lineId)}
                              className="flex items-center gap-1 hover:text-red-500"
                            >
                              <Trash2 size={13} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Link to="/shop" className="inline-block text-sm font-medium text-brand-accent hover:underline">
                ← Continue Shopping
              </Link>
            </div>

            <Card className="h-fit p-6">
              <h3 className="font-semibold text-brand-text">Total</h3>
              <div className="mt-4 flex gap-2">
                <input
                  placeholder="Apply Coupon"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 rounded-lg border border-brand-text/15 px-3 py-2 text-sm"
                />
                <Button variant="outline" size="sm">Apply</Button>
              </div>
              <div className="mt-5 space-y-2 border-t border-brand-text/8 pt-4 text-sm">
                <div className="flex justify-between text-brand-text/60">
                  <span>Sub Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-brand-text/60">
                  <span>Delivery Charges</span>
                  <span>${deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-brand-text/60">
                  <span>Security Deposit</span>
                  <span>${depositTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-brand-text/8 pt-2 font-semibold text-brand-text">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button onClick={() => navigate("/checkout")} className="mt-5 w-full">
                Checkout
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
