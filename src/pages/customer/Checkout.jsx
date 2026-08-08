import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Truck, Store, Check } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useStore } from "../../context/StoreContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const STEPS = ["Address", "Payment"];

export default function Checkout() {
  const { items, subtotal, depositTotal, clearCart } = useCart();
  const { createOrder } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState("store");
  const [address, setAddress] = useState({ name: user?.name || "", line1: "", city: "", zip: "" });
  const [card, setCard] = useState({ number: "", name: "", expiry: "" });
  const deliveryCharge = deliveryMethod === "shipping" ? 15 : 0;
  const total = subtotal + deliveryCharge + depositTotal;

  const handlePay = () => {
    items.forEach((item) => {
      createOrder({
        customer: user?.name || address.name,
        productId: item.product.id,
        qty: item.qty,
        pickupDate: item.startDate,
        returnDate: item.endDate,
        total: item.product.pricePerDay * item.qty,
        depositHeld: item.product.securityDeposit * item.qty,
        invoiceStatus: "invoiced",
        status: "reserved",
      });
    });
    clearCart();
    navigate("/order-confirmation");
  };

  if (items.length === 0 && step === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center gap-3 text-sm">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${i <= step ? "text-brand-accent" : "text-brand-text/35"}`}>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    i < step ? "bg-brand-accent text-white" : i === step ? "border-2 border-brand-accent" : "border border-brand-text/20"
                  }`}
                >
                  {i < step ? <Check size={12} /> : i + 1}
                </span>
                {s}
              </div>
              {i < STEPS.length - 1 && <div className="h-px w-10 bg-brand-text/15" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
            {step === 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-brand-text">Delivery Method</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDeliveryMethod("shipping")}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left ${
                      deliveryMethod === "shipping" ? "border-brand-accent bg-brand-accentSoft" : "border-brand-text/15"
                    }`}
                  >
                    <Truck size={18} className="text-brand-accent" />
                    <div>
                      <p className="text-sm font-medium">Standard Delivery</p>
                      <p className="text-xs text-brand-text/45">$15.00</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setDeliveryMethod("store")}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left ${
                      deliveryMethod === "store" ? "border-brand-accent bg-brand-accentSoft" : "border-brand-text/15"
                    }`}
                  >
                    <Store size={18} className="text-brand-accent" />
                    <div>
                      <p className="text-sm font-medium">Pick up from Store</p>
                      <p className="text-xs text-brand-text/45">Free</p>
                    </div>
                  </button>
                </div>

                {deliveryMethod === "shipping" && (
                  <div className="mt-6 space-y-4">
                    <Input label="Full Name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} />
                    <Input label="Address" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                      <Input label="Zip Code" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
                    </div>
                  </div>
                )}

                <Button onClick={() => setStep(1)} className="mt-6 w-full">
                  Confirmed →
                </Button>
              </Card>
            )}

            {step === 1 && (
              <Card className="p-6">
                <h3 className="font-semibold text-brand-text">Payment Method</h3>
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-brand-accent bg-brand-accentSoft p-4">
                  <CreditCard size={18} className="text-brand-accent" />
                  <span className="text-sm font-medium">Card</span>
                </div>
                <div className="mt-4 space-y-4">
                  <Input
                    label="Card Number"
                    placeholder="XXXX XXXX XXXX XXXX"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Name on Card" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
                    <Input label="Expiry" placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-brand-text/60">
                    <input type="checkbox" className="accent-brand-accent" /> Save my payment details
                  </label>
                </div>
                <div className="mt-6 flex gap-3">
                  <Button variant="outline" onClick={() => setStep(0)}>← Back</Button>
                  <Button onClick={handlePay} className="flex-1">
                    Pay Now (includes deposit)
                  </Button>
                </div>
              </Card>
            )}
          </motion.div>

          <Card className="h-fit p-6">
            <h3 className="mb-4 font-semibold text-brand-text">Order Summary</h3>
            <div className="max-h-64 space-y-3 overflow-y-auto brand-scroll pr-1">
              {items.map((item) => (
                <div key={item.lineId} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-brand-text">{item.product.name}</p>
                    <p className="text-xs text-brand-text/40">{item.qty} × ${item.product.pricePerDay}/day</p>
                  </div>
                  <span className="text-brand-text/70">${(item.product.pricePerDay * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-brand-text/8 pt-4 text-sm">
              <div className="flex justify-between text-brand-text/60"><span>Sub Total</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-brand-text/60"><span>Delivery Charges</span><span>${deliveryCharge.toFixed(2)}</span></div>
              <div className="flex justify-between text-brand-text/60"><span>Security Deposit</span><span>${depositTotal.toFixed(2)}</span></div>
              <div className="flex justify-between border-t border-brand-text/8 pt-2 font-semibold text-brand-text"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
