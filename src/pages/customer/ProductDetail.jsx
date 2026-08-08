import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Clock } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { useStore } from "../../context/StoreContext.jsx";
import { useCart } from "../../context/CartContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useStore();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);

  const [qty, setQty] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [variant, setVariant] = useState({});
  const [showVariantModal, setShowVariantModal] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <p className="p-10 text-center text-brand-text/50">Product not found.</p>
      </div>
    );
  }

  const hasVariants = Object.keys(product.variants || {}).length > 0;

  const confirmAddToCart = () => {
    addItem(product, { qty, startDate, endDate, variant });
    setShowVariantModal(false);
    navigate("/cart");
  };

  const handleAddToCart = () => {
    if (hasVariants && Object.keys(variant).length < Object.keys(product.variants).length) {
      setShowVariantModal(true);
      return;
    }
    confirmAddToCart();
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <motion.img
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            src={product.image}
            alt={product.name}
            className="aspect-square w-full rounded-2xl object-cover shadow-card"
          />

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-brand-accent">{product.category}</p>
            <h1 className="mt-2 text-2xl font-semibold text-brand-text">{product.name}</h1>
            <p className="mt-3 text-2xl font-semibold text-brand-accent">
              ${product.pricePerDay}
              <span className="text-sm font-normal text-brand-text/40"> / day</span>
              <span className="ml-3 text-sm font-normal text-brand-text/40">${product.pricePerHour}/hr · ${product.pricePerWeek}/wk</span>
            </p>

            <p className="mt-4 text-sm leading-relaxed text-brand-text/60">{product.description}</p>

            <div className="mt-5 flex flex-wrap gap-3 text-xs text-brand-text/50">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-accentSoft px-3 py-1.5">
                <ShieldCheck size={13} /> ${product.securityDeposit} security deposit
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-accentSoft px-3 py-1.5">
                <Clock size={13} /> Pickup {product.rental.pickupTime} · Return {product.rental.returnTime}
              </span>
            </div>

            {hasVariants && (
              <div className="mt-6 space-y-4">
                {Object.entries(product.variants).map(([attr, values]) => (
                  <div key={attr}>
                    <p className="mb-2 text-sm font-medium text-brand-text/70">{attr}</p>
                    <div className="flex flex-wrap gap-2">
                      {values.map((v) => (
                        <button
                          key={v}
                          onClick={() => setVariant((prev) => ({ ...prev, [attr]: v }))}
                          className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                            variant[attr] === v
                              ? "border-brand-accent bg-brand-accentSoft text-brand-accentDark"
                              : "border-brand-text/15 text-brand-text/60 hover:border-brand-accent"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-brand-text/60">Start date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-brand-text/15 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-brand-text/60">End date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-brand-text/15 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-xl border border-brand-text/15">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 text-brand-text/60">-</button>
                <span className="w-8 text-center text-sm font-medium">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2 text-brand-text/60">+</button>
              </div>
              <Button onClick={handleAddToCart} size="lg" className="flex-1">
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal open={showVariantModal} onClose={() => setShowVariantModal(false)} title="Select variant">
        <p className="mb-4 text-sm text-brand-text/60">
          This product has multiple variants — pick one before adding it to your cart.
        </p>
        <div className="space-y-4">
          {Object.entries(product.variants).map(([attr, values]) => (
            <div key={attr}>
              <p className="mb-2 text-sm font-medium text-brand-text/70">{attr}</p>
              <div className="flex flex-wrap gap-2">
                {values.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVariant((prev) => ({ ...prev, [attr]: v }))}
                    className={`rounded-full border px-3.5 py-1.5 text-sm ${
                      variant[attr] === v
                        ? "border-brand-accent bg-brand-accentSoft text-brand-accentDark"
                        : "border-brand-text/15 text-brand-text/60"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowVariantModal(false)}>Cancel</Button>
          <Button onClick={confirmAddToCart}>Confirm</Button>
        </div>
      </Modal>
    </div>
  );
}
