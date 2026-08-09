import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Truck, Store, ShieldCheck } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useStore } from "../../context/StoreContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatCurrency } from "../../utils/lateFee.js";

const STEPS = ["Fulfillment & Address", "Payment & Confirmation"];

export default function Checkout() {
  const { items, subtotal, depositTotal, clearCart } = useCart();
  const { createOrder } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const passedState = location.state || {};
  const [step, setStep] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState(passedState.deliveryMethod || "delivery");
  const [address, setAddress] = useState({
    name: user?.name || "John Doe",
    line1: "221B Baker Street",
    city: "Mumbai",
    zip: "400001",
  });
  const [card, setCard] = useState({
    number: "4532 •••• •••• 8821",
    name: user?.name || "John Doe",
    expiry: "12/28",
  });

  const discountAmount = passedState.discountAmount || subtotal * 0.1;
  const deliveryCharge = deliveryMethod === "delivery" ? (items.length ? 15 : 0) : 0;
  const finalSubtotal = Math.max(subtotal - discountAmount, 0);
  const grandTotal = finalSubtotal + deliveryCharge + depositTotal;

  const handlePay = () => {
    const createdIds = items
      .map((item) =>
        createOrder({
          customer: user?.name || address.name || "Customer",
          productId: item.product.id,
          qty: item.qty,
          pickupDate: item.startDate || new Date().toISOString(),
          returnDate: item.endDate || new Date(Date.now() + 86400000 * 3).toISOString(),
          total: (item.product.pricePerDay || 20) * item.qty,
          depositHeld: (item.product.securityDeposit || 50) * item.qty,
          deliveryMethod: deliveryMethod === "delivery" ? "Standard Shipping" : "Store Pickup",
          invoiceStatus: "invoiced",
          status: "reserved",
        })
      )
      .filter(Boolean);

    clearCart();
    navigate("/order-confirmation", { state: { orderId: createdIds[0] || "SO0010" } });
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center text-sm text-brand-text/70">
          <p className="mb-4 font-semibold text-brand-text">Your cart is empty.</p>
          <p>Add rental items to continue with checkout.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-brand-text/60">
            {STEPS.map((stepLabel, index) => (
              <div key={stepLabel} className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${
                    index === step
                      ? "border-brand-accent bg-brand-accent text-white"
                      : index < step
                      ? "border-brand-accent text-brand-accent"
                      : "border-brand-text/20 text-brand-text/50"
                  }`}
                >
                  {index + 1}
                </span>
                <span className={index === step ? "font-semibold text-brand-text" : "text-brand-text/50"}>{stepLabel}</span>
              </div>
            ))}
          </div>
          <div className="text-xs text-brand-text/50">Step {step + 1} of {STEPS.length}</div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
            {step === 0 && (
              <Card className="p-6 space-y-5">
                <h3 className="font-semibold text-brand-text text-base">Select Delivery &amp; Address</h3>
                <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("delivery")}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                      deliveryMethod === "delivery" ? "border-brand-accent bg-brand-accentSoft" : "border-brand-text/15"
                    }`}
                  >
                    <Truck size={20} className="text-brand-accent shrink-0" />
                    <div>
                      <p className="font-semibold text-brand-text">Standard Delivery</p>
                      <p className="text-[11px] text-brand-text/45">$15.00 · Delivered to door</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("pickup")}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                      deliveryMethod === "pickup" ? "border-brand-accent bg-brand-accentSoft" : "border-brand-text/15"
                    }`}
                  >
                    <Store size={20} className="text-brand-accent shrink-0" />
                    <div>
                      <p className="font-semibold text-brand-text">Pick up from Store</p>
                      <p className="text-[11px] text-brand-text/45">FREE · Ready in 1 hour</p>
                    </div>
                  </button>
                </div>

                {deliveryMethod === "delivery" ? (
                  <div className="space-y-3 pt-2">
                    <Input
                      label="Full Name"
                      value={address.name}
                      onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    />
                    <Input
                      label="Street Address"
                      value={address.line1}
                      onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        label="City"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      />
                      <Input
                        label="Zip Code"
                        value={address.zip}
                        onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-brand-accentSoft/40 p-4 border border-brand-accent/20 text-xs space-y-1">
                    <p className="font-semibold text-brand-text">RentFlow Store Location:</p>
                    <p className="text-brand-text/70">Main Hub #42, Industrial Park, Sector 5, City Center</p>
                    <p className="text-brand-text/50">Store Hours: Mon–Sat 9:00 AM – 7:00 PM</p>
                  </div>
                )}

                <Button onClick={() => setStep(1)} className="w-full mt-4">
                  Continue to Payment →
                </Button>
              </Card>
            )}

            {step === 1 && (
              <Card className="p-6 space-y-5">
                <h3 className="font-semibold text-brand-text text-base">Payment Method &amp; Deposit</h3>
                <div className="flex items-center gap-3 rounded-xl border border-brand-accent bg-brand-accentSoft p-4">
                  <CreditCard size={20} className="text-brand-accent" />
                  <div>
                    <p className="text-sm font-semibold text-brand-text">Credit / Debit Card</p>
                    <p className="text-xs text-brand-text/50">Encrypted &amp; Secured Payment</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <Input
                    label="Card Number"
                    placeholder="XXXX XXXX XXXX XXXX"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: e.target.value })}
                  />
                  <Input
                    label="Name on Card"
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value })}
                  />
                  <Input
                    label="Expiry"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                  />
                </div>

                <div className="rounded-xl bg-amber-50 p-3.5 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <ShieldCheck size={15} className="text-amber-700" /> Security Deposit Guarantee
                  </div>
                  <p className="text-amber-800/80">
                    A deposit of <strong>{formatCurrency(depositTotal)}</strong> is collected today. It will be 100% refunded automatically upon timely return of the rental items.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(0)}>
                    ← Back
                  </Button>
                  <Button onClick={handlePay} className="flex-1">
                    Confirm Order &amp; Pay {formatCurrency(grandTotal)}
                  </Button>
                </div>
              </Card>
            )}
          </motion.div>

          <Card className="h-fit p-6 space-y-4">
            <h3 className="font-semibold text-brand-text text-base">Rental Summary</h3>
            <div className="max-h-64 space-y-3 overflow-y-auto brand-scroll pr-1 text-xs">
              {items.map((item) => (
                <div key={item.lineId} className="flex justify-between border-b border-brand-text/5 pb-2">
                  <div>
                    <p className="font-medium text-brand-text">{item.product.name}</p>
                    <p className="text-brand-text/50">{item.qty} unit(s) · {item.startDate || "Today"}</p>
                  </div>
                  <span className="font-semibold text-brand-text">
                    {formatCurrency((item.product.pricePerDay || 20) * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-brand-text/8 pt-3 text-sm">
              <div className="flex justify-between text-brand-text/60">
                <span>Rental Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Savings</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-brand-text/60">
                <span>Fulfillment Fee</span>
                <span>{deliveryCharge === 0 ? "FREE" : formatCurrency(deliveryCharge)}</span>
              </div>
              <div className="flex justify-between text-amber-700 font-medium">
                <span>Deposit (Refundable)</span>
                <span>{formatCurrency(depositTotal)}</span>
              </div>
              <div className="flex justify-between border-t border-brand-text/8 pt-2 text-base font-bold text-brand-text">
                <span>Total Due</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
